import { RecurringIntervalType } from '@/enums/fee/recurring-interval-type';

export const isRecurringFeeMonthIntervalType = (intervalType?: RecurringIntervalType | null) => intervalType === RecurringIntervalType.MONTH;
export const isRecurringFeeWeekIntervalType = (intervalType?: RecurringIntervalType | null) => intervalType === RecurringIntervalType.WEEK;
