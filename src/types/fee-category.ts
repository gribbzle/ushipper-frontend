import { FeeCategoryType } from '@/enums/fee/fee-category-types-enum';
import { FeeCategoryValueType } from '@/enums/fee/fee-category-value-types-enum';
import { FeeRecurringWeekDay } from '@/enums/fee/fee-recurring-week-days-enum';
import { RecurringIntervalType } from '@/enums/fee/recurring-interval-type';

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
