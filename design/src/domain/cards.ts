import type { Card } from '../contracts/model';
export function points(card: Card): number { return card.rank === 1 || card.rank > 10 ? 10 : card.rank; }
export function total(cards: readonly Card[]): number { return cards.reduce((n, c) => n + points(c), 0); }
export function validCard(c: Card): boolean {
  return Boolean(c.id) && [1, 2].includes(c.deck) && Number.isInteger(c.rank)
    && c.rank >= 1 && c.rank <= 13 && ['C', 'D', 'H', 'S'].includes(c.suit);
}
export function validateHand(hand: readonly Card[]): void {
  if (hand.length !== 10 || !hand.every(validCard)) throw new Error('INVALID_HAND');
  if (new Set(hand.map(c => c.id)).size !== 10) throw new Error('REUSED_CARD');
  if (new Set(hand.map(c => `${c.deck}:${c.suit}:${c.rank}`)).size !== 10) throw new Error('REUSED_PHYSICAL_COPY');
}
export function sameSuit(cards: readonly Card[]): boolean { return cards.every(c => c.suit === cards[0]?.suit); }
function consecutive(ranks: number[]): boolean {
  ranks.sort((a, b) => a - b);
  return ranks.every((r, i) => i === 0 || r === ranks[i - 1] + 1);
}
export function isMeld(cards: readonly Card[]): boolean {
  if (cards.length < 3) return false;
  if (cards.every(c => c.rank === cards[0].rank)) return true;
  if (!sameSuit(cards)) return false;
  return consecutive(cards.map(c => c.rank)) || consecutive(cards.map(c => c.rank === 1 ? 14 : c.rank));
}
