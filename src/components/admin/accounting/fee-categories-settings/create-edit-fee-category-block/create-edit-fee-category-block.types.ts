import { FeeCategoryType } from '@/enums/fee/fee-category-types-enum';
import { FeeCategoryValueType } from '@/enums/fee/fee-category-value-types-enum';

export type CreateEditFeeCategoryFormState = {
    name: string;
    type: FeeCategoryType;
    defaultValue: number;
    valueType: FeeCategoryValueType;
    balanceId?: string;
    defaultLimit?: number | null;
};
