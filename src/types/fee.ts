import { FeeCategoryTermType } from '@/enums/fee/fee-category-term-types-enum';
import { FeeCategoryValueType } from '@/enums/fee/fee-category-value-types-enum';
import { FeePeriod } from '@/enums/fee/fee-periods-enum';
import { FeeRecurringWeekDay } from '@/enums/fee/fee-recurring-week-days-enum';
import { RecurringIntervalType } from '@/enums/fee/recurring-interval-type';

import { FeeCategory } from './fee-category';

export type Fee = {
    id: number;
    feeCategory: FeeCategory;
    value: number;
    valueType: FeeCategoryValueType;
    termType: FeeCategoryTermType;
    recurringMonthDay: number | null;
    recurringWeekDay: FeeRecurringWeekDay | null;
    intervalType: RecurringIntervalType | null;
    intervalValue: number | null;
    createdAt: string;
    updatedAt: string | null;
    accountId: string | null;
    companyId: string | null;
    chargedTotal: number | null;
    limit: number | null;
};

export type FeeData = {
    feeId?: number;
    feeCategoryId: number;
    value: number;
    valueType: FeeCategoryValueType;
    termType: FeeCategoryTermType | null;
    recurringMonthDay: number | null;
    recurringWeekDay: FeeRecurringWeekDay | null;
    intervalType: RecurringIntervalType | null;
    intervalValue: number | null;
    limit: number | null;
    chargedTotal: number | null;
    accountId: string | null;
    companyId: string | null;
};

export type FeeParams = {
    accountId?: string;
    companyId?: string;
};

export type RecurringFeeData = FeeData & { period?: FeePeriod };
