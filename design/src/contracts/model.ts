export type Mode = string;
export type Suit = 'C' | 'D' | 'H' | 'S';
export type Closure = 'combinaciones' | 'pintas' | 'toque';
export interface Card { readonly id: string; readonly deck: 1 | 2; readonly rank: number; readonly suit: Suit }
export interface Player { readonly id: string; readonly score: number; readonly hand: readonly Card[] }
export interface RoundState {
  readonly gameId: string; readonly roundId: string; readonly mode: Mode; readonly rulesVersion: number;
  readonly version: number; readonly status: 'open' | 'closed'; readonly phase: 'decision' | 'draw' | 'discard' | 'closed';
  readonly turnPlayerId: string; readonly players: readonly Player[];
}
export interface CloseCommand { readonly roundId: string; readonly operationId: string; readonly expectedVersion: number; readonly closure: Closure }
export interface ScoreChange { readonly playerId: string; readonly before: number; readonly delta: number; readonly after: number }
export interface Settlement {
  readonly gameId: string; readonly roundId: string; readonly version: number;
  readonly changes: readonly ScoreChange[]; readonly eliminated: readonly string[];
  readonly winnerId: string | null; readonly next: 'home' | 'next-round';
}
export interface RuleContext { readonly state: RoundState; readonly actorId: string; readonly closure: Closure }
export interface Variant {
  readonly key: string; readonly version: number;
  settle(context: RuleContext): Omit<Settlement, 'gameId' | 'roundId' | 'version'>;
}
export interface PendingEvent { readonly id: string; readonly gameId: string; readonly version: number; readonly type: 'RoundClosed' }
