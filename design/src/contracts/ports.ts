import type { CloseCommand, PendingEvent, RoundState, Settlement } from './model';
export interface SavedOperation { readonly actorId: string; readonly fingerprint: string; readonly result: Settlement }
export interface RoundTransaction {
  state: RoundState;
  operation(id: string): Promise<SavedOperation | undefined>;
  save(id: string, operation: SavedOperation, event: PendingEvent): Promise<void>;
}
export interface RoundStore {
  withLockedRound<T>(gameId: string, roundId: string, action: (tx: RoundTransaction) => Promise<T>): Promise<T>;
}
export interface EventStore { pending(): Promise<readonly PendingEvent[]>; delivered(id: string): Promise<void> }
export interface AuthorizedPublisher { publish(event: PendingEvent): Promise<void> }
export interface GameGateway { close(gameId: string, command: CloseCommand): Promise<Settlement> }
