import { RecurringIntervalType } from '@enums';

export const isRecurringFeeMonthIntervalType = (intervalType?: RecurringIntervalType | null) => intervalType === RecurringIntervalType.MONTH;
export const isRecurringFeeWeekIntervalType = (intervalType?: RecurringIntervalType | null) => intervalType === RecurringIntervalType.WEEK;
