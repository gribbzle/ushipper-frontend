import { toKebabCase } from 'js-convert-case';

import { CommodityPackingGroupEnum } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const packingGroupTranslate = translateByNamespace('common:commodity:packing-group');

export const getPackingGroupTranslate = (type: CommodityPackingGroupEnum): string => packingGroupTranslate(toKebabCase(type));
