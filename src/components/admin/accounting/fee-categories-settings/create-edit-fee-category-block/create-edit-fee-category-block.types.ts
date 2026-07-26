import { FeeCategoryType, FeeCategoryValueType } from '@/enums';

export type CreateEditFeeCategoryFormState = {
    name: string;
    type: FeeCategoryType;
    defaultValue: number;
    valueType: FeeCategoryValueType;
    balanceId?: string;
    defaultLimit?: number | null;
};
