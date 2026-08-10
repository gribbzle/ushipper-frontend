import has from 'has-values';

import { CommodityTypesEnum } from '@/enums/commodity/commodity-types-enum';
import { translateByNamespace } from '@/utils/i18n';
import { getObjectWithoutEmptyFields } from '@/utils/objects';
import { OrderCommodity } from '@store/api/orders-api';

import { getCommodityTypeTranslate } from './translate';

const t = translateByNamespace('client:popups:delete-commodity');

export const getFullNameOfCommodity = ({ name, description }: Pick<OrderCommodity, 'description' | 'name'>): string => {
    const commodityFullName = getObjectWithoutEmptyFields({
        name,
        description,
    });

    return has(commodityFullName) ? Object.values(commodityFullName).join(' - ') : t('empty-title');
};

export const getSizesOfCommodity = ({ height, length, width }: OrderCommodity) =>
    getObjectWithoutEmptyFields({
        length: length ? `${length}” L` : null,
        width: width ? `${width}” W` : null,
        height: height ? `${height}” H` : null,
    });

const unitFields = ['weightUnit', 'volumeUnit', 'dimensionUnit', 'temperatureUnit', 'stackable', 'hazardous', 'updatedAt', 'createdAt', 'publicId'] as const;

export const hasNonUnitCommodityFields = (el: Partial<OrderCommodity>): boolean =>
    Object.keys(el).some(key => {
        return !unitFields.includes(key as (typeof unitFields)[number]) && el[key as keyof OrderCommodity] != null;
    });

export const calculateTotalWeightOfCommodities = (commodities: OrderCommodity[]): number =>
    commodities.reduce((total, commodity) => total + (commodity.weight ?? 0), 0);

export const calculateTotalQuantitiesOfCommodities = (commodities: OrderCommodity[]): string => {
    const totals = commodities.reduce((acc, commodity) => {
        const type = commodity.type || CommodityTypesEnum.OTHER;
        const quantity = commodity.quantity ?? 0;

        if (!acc[type]) {
            acc[type] = 0;
        }
        acc[type] += quantity;

        return acc;
    }, {} as Record<CommodityTypesEnum, number>);

    return Object.entries(totals)
        .map(([type, quantity]) => `${quantity} ${getCommodityTypeTranslate(type as CommodityTypesEnum, quantity)}`)
        .join(', ');
};
