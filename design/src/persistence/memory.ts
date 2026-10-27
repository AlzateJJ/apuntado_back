import type { PendingEvent, RoundState } from '../contracts/model';
import type { EventStore, RoundStore, RoundTransaction, SavedOperation } from '../contracts/ports';
/** Adaptador transaccional de prueba; no sustituye las garantías de PostgreSQL. */
export class MemoryStore implements RoundStore, EventStore {
  private operations = new Map<string, SavedOperation>();
  private events = new Map<string, PendingEvent>();
  private gate: Promise<unknown> = Promise.resolve();
  public failBeforeCommit = false;
  constructor(public state: RoundState) {}
  withLockedRound<T>(gameId: string, roundId: string, action: (tx: RoundTransaction) => Promise<T>): Promise<T> {
    const task = this.gate.then(() => this.run(gameId, roundId, action));
    this.gate = task.catch(() => undefined);
    return task;
  }
  private async run<T>(gameId: string, roundId: string, action: (tx: RoundTransaction) => Promise<T>): Promise<T> {
    if (this.state.gameId !== gameId || this.state.roundId !== roundId) throw new Error('NOT_FOUND');
    const snapshot = structuredClone(this.state);
    const operations = new Map(this.operations);
    const events = new Map(this.events);
    const tx: RoundTransaction = {
      state: snapshot,
      operation: async id => operations.get(id),
      save: async (id, op, event) => {
        operations.set(id, structuredClone(op)); events.set(event.id, event);
        tx.state = { ...snapshot, status: 'closed', phase: 'closed', version: op.result.version,
          players: snapshot.players.map(p => ({ ...p, score: op.result.changes.find(c => c.playerId === p.id)?.after ?? p.score })) };
      }
    };
    const result = await action(tx);
    if (this.failBeforeCommit) throw new Error('SIMULATED_STORAGE_FAILURE');
    this.state = tx.state; this.operations = operations; this.events = events;
    return result;
  }
  async pending(): Promise<readonly PendingEvent[]> { return [...this.events.values()]; }
  async delivered(id: string): Promise<void> { this.events.delete(id); }
  operationCount(): number { return this.operations.size; }
}
