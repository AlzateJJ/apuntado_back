import type { CloseCommand, RoundState, Settlement } from '../contracts/model';
import type { RoundStore, RoundTransaction } from '../contracts/ports';
import { VariantCatalog } from './catalog';
function authorize(state: RoundState, actorId: string): void {
  if (!state.players.some(p => p.id === actorId)) throw new Error('NOT_MEMBER');
  if (state.turnPlayerId !== actorId) throw new Error('NOT_YOUR_TURN');
}
function validateState(state: RoundState, command: CloseCommand): void {
  if (state.status !== 'open' || state.phase !== 'decision') throw new Error('ROUND_NOT_READY');
  if (state.version !== command.expectedVersion) throw new Error('STALE_VERSION');
  if (state.players.some(p => p.score <= -101)) throw new Error('ELIMINATED_PLAYER');
}
export class CloseRound {
  constructor(private readonly store: RoundStore, private readonly catalog: VariantCatalog) {}
  execute(gameId: string, actorId: string, command: CloseCommand): Promise<Settlement> {
    if (!command.operationId || command.operationId.length > 128) throw new Error('INVALID_OPERATION_ID');
    return this.store.withLockedRound(gameId, command.roundId, tx => this.apply(tx, actorId, command));
  }
  private async apply(tx: RoundTransaction, actorId: string, command: CloseCommand): Promise<Settlement> {
    authorize(tx.state, actorId);
    const fingerprint = JSON.stringify([tx.state.roundId, command.expectedVersion, command.closure]);
    const previous = await tx.operation(command.operationId);
    if (previous) {
      if (previous.actorId !== actorId || previous.fingerprint !== fingerprint) throw new Error('IDEMPOTENCY_CONFLICT');
      return previous.result;
    }
    validateState(tx.state, command);
    const decision = this.catalog.get(tx.state.mode, tx.state.rulesVersion).settle({ state: tx.state, actorId, closure: command.closure });
    const result: Settlement = { ...decision, gameId: tx.state.gameId, roundId: tx.state.roundId, version: tx.state.version + 1 };
    await tx.save(command.operationId, { actorId, fingerprint, result },
      { id: `${tx.state.gameId}:${tx.state.roundId}:closed`, gameId: tx.state.gameId, version: result.version, type: 'RoundClosed' });
    return result;
  }
}
