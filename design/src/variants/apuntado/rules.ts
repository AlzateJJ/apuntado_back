import type { Closure, Player, RuleContext, Variant } from '../../contracts/model';
import { sameSuit, validateHand } from '../../domain/cards';
import { closesPattern, minimumPenalty, touchPenalty } from '../../domain/combinations';
function actorDelta(actor: Player, closure: Closure): number {
  const complete = closesPattern(actor.hand, [[4, 3, 3], [5, 5]]);
  if (closure === 'pintas' && sameSuit(actor.hand)) return 25;
  if (closure === 'combinaciones' && complete) return 10;
  if (closure === 'toque' && !complete && !sameSuit(actor.hand)) return -touchPenalty(actor.hand, actor.score);
  throw new Error('INVALID_CLOSE');
}
export const apuntado: Variant = Object.freeze({
  key: 'apuntado', version: 1,
  settle({ state, actorId, closure }: RuleContext) {
    state.players.forEach(p => validateHand(p.hand));
    const actor = state.players.find(p => p.id === actorId);
    if (!actor) throw new Error('NOT_MEMBER');
    const delta = actorDelta(actor, closure);
    const changes = state.players.map(p => {
      const penalty = minimumPenalty(p.hand);
      const change = p.id === actorId ? delta : (penalty === 0 ? 0 : -penalty);
      return { playerId: p.id, before: p.score, delta: change, after: p.score + change };
    });
    const active = changes.filter(c => c.after > -101);
    const winner = changes.find(c => c.after >= 51) ?? (active.length === 1 ? active[0] : undefined);
    return { changes, eliminated: changes.filter(c => c.after <= -101).map(c => c.playerId),
      winnerId: winner?.playerId ?? null, next: winner ? 'home' as const : 'next-round' as const };
  }
});
