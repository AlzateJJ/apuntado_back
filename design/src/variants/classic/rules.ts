import type { RuleContext, Variant } from '../../contracts/model';
import { validateHand } from '../../domain/cards';
import { closesPattern } from '../../domain/combinations';
export const classic: Variant = Object.freeze({
  key: 'classic', version: 1,
  settle({ state, actorId, closure }: RuleContext) {
    const actor = state.players.find(p => p.id === actorId);
    if (!actor) throw new Error('NOT_MEMBER');
    validateHand(actor.hand);
    if (closure !== 'combinaciones' || !closesPattern(actor.hand, [[4, 3, 3]])) throw new Error('INVALID_CLASSIC_CLOSE');
    return { changes: [], eliminated: [], winnerId: actorId, next: 'home' as const };
  }
});
