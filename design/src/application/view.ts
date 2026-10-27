import type { RoundState } from '../contracts/model';
export function authorizedView(state: RoundState, actorId: string) {
  if (!state.players.some(p => p.id === actorId)) throw new Error('NOT_MEMBER');
  return { gameId: state.gameId, version: state.version, status: state.status,
    players: state.players.map(p => ({ id: p.id, score: p.score, cardCount: p.hand.length,
      hand: state.status === 'closed' || p.id === actorId ? p.hand : undefined })) };
}
