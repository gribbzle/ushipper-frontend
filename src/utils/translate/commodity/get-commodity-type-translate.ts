import { toKebabCase } from 'js-convert-case';

import { CommodityTypesEnum } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const commodityTypeTranslate = translateByNamespace('common:commodity:commodity-types');

/**
 * Returns the translation of the commodity type with support for pluralization.
 * @param type - The commodity type from CommodityTypesEnum
 * @param count - The quantity of commodities to determine the plural form
 * @returns Translated commodity type
 */

export const getCommodityTypeTranslate = (type: CommodityTypesEnum, count?: number | null): string => {
    const key = toKebabCase(type);

    return count ? commodityTypeTranslate(key, { count }) : commodityTypeTranslate(`${key}_one`);
};
