import type { Card } from '../contracts/model';
import { isMeld, sameSuit, total } from './cards';
const FULL = (1 << 10) - 1;
interface Meld { mask: number; size: number }
export function subset(hand: readonly Card[], mask: number): Card[] { return hand.filter((_, i) => (mask & (1 << i)) !== 0); }
function melds(hand: readonly Card[]): Meld[] {
  const found: Meld[] = [];
  for (let mask = 1; mask <= FULL; mask++) {
    const cards = subset(hand, mask);
    if (isMeld(cards)) found.push({ mask, size: cards.length });
  }
  return found;
}
function cover(all: Meld[], pattern: readonly number[], used: number): boolean {
  if (pattern.length === 0) return used === FULL;
  return all.some(m => m.size === pattern[0] && !(m.mask & used) && cover(all, pattern.slice(1), used | m.mask));
}
export function closesPattern(hand: readonly Card[], patterns: readonly (readonly number[])[]): boolean {
  const all = melds(hand);
  return patterns.some(pattern => cover(all, pattern, 0));
}
function coveredMasks(all: Meld[]): Set<number> {
  const reachable = new Set([0]);
  for (let mask = 0; mask <= FULL; mask++) {
    if (!reachable.has(mask)) continue;
    for (const m of all) if (!(mask & m.mask)) reachable.add(mask | m.mask);
  }
  return reachable;
}
export function remainders(hand: readonly Card[]): Card[][] {
  const covered = coveredMasks(melds(hand));
  // Pintas: diez cartas completas, o nueve y una sobrante. Nunca ocho por extensión implícita.
  if (sameSuit(hand)) covered.add(FULL);
  for (let i = 0; i < hand.length; i++) {
    const mask = FULL ^ (1 << i);
    if (sameSuit(subset(hand, mask))) covered.add(mask);
  }
  return [...covered].map(mask => subset(hand, FULL ^ mask));
}
export function minimumPenalty(hand: readonly Card[]): number { return Math.min(...remainders(hand).map(total)); }
export function touchPenalty(hand: readonly Card[], score: number): number {
  const eligible = remainders(hand).filter(r => r.length >= 1 && r.length <= 2).map(total).filter(n => n <= 5);
  const penalty = Math.min(...eligible);
  if (!Number.isFinite(penalty) || score - penalty <= -101) throw new Error('INVALID_TOUCH');
  return penalty;
}
