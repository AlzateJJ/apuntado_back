import { VariantCatalog } from '../application/catalog';
import { classic } from '../variants/classic/rules';
import { apuntado } from '../variants/apuntado/rules';
export const catalog = new VariantCatalog([classic, apuntado]);
