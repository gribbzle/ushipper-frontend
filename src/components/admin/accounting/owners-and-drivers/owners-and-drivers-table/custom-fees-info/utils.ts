import { Fee } from '@types';
import { isRecurringFeeMonthIntervalType, isRecurringFeeWeekIntervalType } from '@utils/transaction/get-is-recurring-fee-interval-type';
import { summarizeFees } from '@utils/transaction/summarize-fees';

export const formatRecurringFees = (fees: Fee[]) => {
    const weeklyFees = fees.filter(({ recurringWeekDay, intervalType }) => recurringWeekDay || isRecurringFeeWeekIntervalType(intervalType));
    const monthlyFees = fees.filter(({ recurringMonthDay, intervalType }) => recurringMonthDay || isRecurringFeeMonthIntervalType(intervalType));

    const weeklyFeesFormatted = summarizeFees(weeklyFees);
    const monthlyFeesFormatted = summarizeFees(monthlyFees);

    return `${weeklyFeesFormatted ? weeklyFeesFormatted : '—'} / ${monthlyFeesFormatted ? monthlyFeesFormatted : '—'}`;
};
