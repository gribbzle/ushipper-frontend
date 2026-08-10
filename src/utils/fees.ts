import { FeeCategoryValueType } from '@/enums/fee/fee-category-value-types-enum';

export const isFeeValueTypePercent = (valueType: FeeCategoryValueType): boolean => valueType === FeeCategoryValueType.PERCENT;
export const isFeeValueTypeFixed = (valueType: FeeCategoryValueType): boolean => valueType === FeeCategoryValueType.FIXED;

export const formatFeeValueType = (valueType: FeeCategoryValueType): string => {
    if (isFeeValueTypePercent(valueType)) {
        return '%';
    }

    return '$';
};
