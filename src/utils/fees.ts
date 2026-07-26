import { FeeCategoryValueType } from '@enums';

export const isFeeValueTypePercent = (valueType: FeeCategoryValueType): boolean => valueType === FeeCategoryValueType.PERCENT;
export const isFeeValueTypeFixed = (valueType: FeeCategoryValueType): boolean => valueType === FeeCategoryValueType.FIXED;

export const formatFeeValueType = (valueType: FeeCategoryValueType): string => {
    if (isFeeValueTypePercent(valueType)) {
        return '%';
    }

    return '$';
};
