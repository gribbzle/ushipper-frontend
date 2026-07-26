import { toKebabCase } from 'js-convert-case';

import { CommodityHazmatClassEnum } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const hazmatClassTranslate = translateByNamespace('common:commodity:hazmat-classes');

export const getHazmatClassTranslate = (val: CommodityHazmatClassEnum): string => hazmatClassTranslate(toKebabCase(val));
