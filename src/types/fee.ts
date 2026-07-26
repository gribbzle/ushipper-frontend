import { FeeCategoryTermType, FeeCategoryValueType, FeePeriod, FeeRecurringWeekDay, RecurringIntervalType } from '@enums';

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
