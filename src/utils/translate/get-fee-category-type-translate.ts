import { toKebabCase } from 'js-convert-case';

import { FeeCategoryType } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const feeCategoryTypeTranslate = translateByNamespace('common:fee-category-types');

export const getFeeCategoryTypeTranslate = (walletType: FeeCategoryType): string => feeCategoryTypeTranslate(toKebabCase(walletType));
