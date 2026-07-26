import { addMonths, addWeeks, format } from 'date-fns';

import { Fee } from '@types';
import { formatFeeValueType } from '@utils';

import { isRecurringFeeMonthIntervalType, isRecurringFeeWeekIntervalType } from './get-is-recurring-fee-interval-type';

export const formatUsedFees = (fees: Fee[]): string =>
    fees.map(({ feeCategory, value, valueType }) => `${feeCategory.name} (${value}${formatFeeValueType(valueType)})`).join(', ');

const formatPeriod = (startDate: Date, endDate: Date): string => {
    endDate.setDate(endDate.getDate() - 1);

    return `<br/>Period: ${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}<br/>`;
};

export const formatFeesWithPeriod = (fees: Fee[], transactionCreatedAt: string): string =>
    fees
        .map(({ feeCategory, value, valueType, recurringMonthDay, recurringWeekDay, intervalType }) => {
            let formattedFee = `${feeCategory.name} (${value}${formatFeeValueType(valueType)})`;
            const startDate = new Date(transactionCreatedAt);

            if (recurringWeekDay || isRecurringFeeWeekIntervalType(intervalType)) {
                const periodEnd = addWeeks(startDate, 1);

                formattedFee += formatPeriod(startDate, periodEnd);
            } else if (recurringMonthDay || isRecurringFeeMonthIntervalType(intervalType)) {
                const periodEnd = addMonths(startDate, 1);

                formattedFee += formatPeriod(startDate, periodEnd);
            }

            return formattedFee;
        })
        .join(', ');
