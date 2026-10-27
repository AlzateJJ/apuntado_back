import type { Pool, PoolClient } from 'pg';
import type { Card, PendingEvent, RoundState } from '../contracts/model';
import type { RoundStore, RoundTransaction, SavedOperation } from '../contracts/ports';
async function loadState(client: PoolClient, gameId: string, roundId: string): Promise<RoundState> {
  // Todos los comandos que mutan la partida adquieren primero este mismo bloqueo.
  const game = await client.query('SELECT * FROM game WHERE game_id=$1 FOR UPDATE', [gameId]);
  if (!game.rows.length) throw new Error('NOT_FOUND');
  const q = await client.query(`SELECT r.*, p.mode, p.version rules_version FROM round r
    JOIN game g USING(game_id) JOIN rule_profile p USING(profile_id)
    WHERE r.game_id=$1 AND r.round_no=$2`, [gameId, roundId]);
  if (!q.rows.length) throw new Error('NOT_FOUND');
  const r = q.rows[0];
  const participants = await client.query(`SELECT s.* FROM current_score s
    WHERE game_id=$1 AND EXISTS (SELECT 1 FROM card_position c WHERE c.game_id=s.game_id
      AND c.owner_id=s.player_id AND c.round_no=$2) ORDER BY player_id`, [gameId, roundId]);
  const players = [];
  for (const p of participants.rows) {
    // Estado anterior a esta ronda: permite recuperar respuestas de cierres ya confirmados.
    const score = await client.query('SELECT COALESCE(SUM(delta),0)::int score FROM score_movement WHERE game_id=$1 AND player_id=$2 AND round_no<$3', [gameId, p.player_id, roundId]);
    const cards = await client.query(`SELECT c.* FROM card_copy c JOIN card_position x USING(game_id,card_no)
      WHERE x.game_id=$1 AND x.round_no=$2 AND x.owner_id=$3 ORDER BY card_no`, [gameId, roundId, p.player_id]);
    const hand: Card[] = cards.rows.map(c => ({ id: String(c.card_no), deck: c.deck, rank: c.rank, suit: c.suit.trim() }));
    players.push({ id: p.player_id, score: score.rows[0].score, hand });
  }
  return { gameId, roundId, mode: r.mode, rulesVersion: r.rules_version, version: game.rows[0].version,
    status: r.status, phase: r.phase, turnPlayerId: r.turn_player_id, players };
}
async function save(client: PoolClient, state: RoundState, id: string, op: SavedOperation, event: PendingEvent): Promise<void> {
  const r = op.result;
  const closure = JSON.parse(op.fingerprint)[2];
  await client.query('INSERT INTO round_result VALUES ($1,$2,$3,$4,$5,$6,$7)',
    [state.gameId, state.roundId, op.actorId, closure, r.winnerId, r.next, r.version]);
  for (const c of r.changes) await client.query('INSERT INTO score_movement VALUES ($1,$2,$3,$4)', [state.gameId,state.roundId,c.playerId,c.delta]);
  await client.query("UPDATE round SET status='closed',phase='closed' WHERE game_id=$1 AND round_no=$2", [state.gameId,state.roundId]);
  await client.query('UPDATE game SET version=$2,status=$3 WHERE game_id=$1', [state.gameId,r.version,r.winnerId ? 'finished' : 'active']);
  await client.query('INSERT INTO processed_operation VALUES ($1,$2,$3,$4,$5)', [state.gameId,id,op.actorId,op.fingerprint,JSON.stringify(r)]);
  await client.query('INSERT INTO outbox(event_id,game_id,version,event_type) VALUES ($1,$2,$3,$4)', [event.id,state.gameId,r.version,event.type]);
}
export class PostgresStore implements RoundStore {
  constructor(private readonly pool: Pool) {}
  async withLockedRound<T>(gameId: string, roundId: string, action: (tx: RoundTransaction) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const state = await loadState(client, gameId, roundId);
      const result = await action({ state,
        operation: async id => {
          const q = await client.query('SELECT * FROM processed_operation WHERE game_id=$1 AND operation_id=$2', [gameId,id]);
          const row = q.rows[0];
          return row ? { actorId: row.actor_id, fingerprint: row.fingerprint, result: row.response } : undefined;
        },
        save: (id, op, event) => save(client, state, id, op, event)
      });
      await client.query('COMMIT');
      return result;
    } catch (error) { await client.query('ROLLBACK'); throw error; }
    finally { client.release(); }
  }
}
