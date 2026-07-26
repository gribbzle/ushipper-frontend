import { FeeCategoryType, FeeCategoryValueType, FeeRecurringWeekDay, RecurringIntervalType } from '@enums';

export type FeeCategory = {
    name: string;
    type: FeeCategoryType;
    defaultValue: number;
    defaultRecurringMonthDay: number | null;
    defaultRecurringWeekDay: FeeRecurringWeekDay | null;
    defaultIntervalType: RecurringIntervalType | null;
    defaultIntervalValue: number | null;
    defaultLimit: number | null;
    createdAt: string;
    id: number;
    updatedAt: string | null;
    valueType: FeeCategoryValueType;
    balanceId: string | null;
};
