import type { Variant } from '../contracts/model';
export class VariantCatalog {
  private readonly entries = new Map<string, Variant>();
  constructor(variants: readonly Variant[]) {
    for (const v of variants) {
      const key = `${v.key}@${v.version}`;
      if (this.entries.has(key)) throw new Error('DUPLICATE_VARIANT');
      this.entries.set(key, v);
    }
  }
  get(key: string, version: number): Variant {
    const variant = this.entries.get(`${key}@${version}`);
    if (!variant) throw new Error('UNKNOWN_RULES_VERSION');
    return variant;
  }
}
