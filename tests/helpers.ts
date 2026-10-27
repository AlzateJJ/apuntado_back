import type { Card, RoundState } from '../design/src/contracts/model';
export const card = (rank: number, suit: Card['suit'], deck: 1 | 2 = 1): Card => ({ id: `${deck}-${suit}-${rank}`, rank, suit, deck });
export const full433 = (): Card[] => [2,3,4,5].map(n=>card(n,'H')).concat([7,9].flatMap(n=>['C','D','S'].map(s=>card(n,s as Card['suit']))));
export const full55 = (): Card[] => [2,3,4,5,6].map(n=>card(n,'H')).concat([7,8,9,10,11].map(n=>card(n,'D')));
export const touch5 = (): Card[] => [7,8,9].flatMap(n=>['C','D','S'].map(s=>card(n,s as Card['suit']))).concat(card(5,'H'));
export function state(mode = 'apuntado', hand = full433(), score = 0): RoundState {
  return { gameId: 'game-1', roundId: '1', mode, rulesVersion: 1, version: 3, status: 'open', phase: 'decision', turnPlayerId: 'ana',
    players: [{ id: 'ana', score, hand }, { id: 'luis', score: 0, hand: full433().map(c=>({...c,deck:2,id:`2-${c.suit}-${c.rank}`})) }] };
}
export const command = { roundId: '1', operationId: 'op-1', expectedVersion: 3, closure: 'combinaciones' as const };
