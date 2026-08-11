import { FeePeriod } from '@/enums/fee/fee-periods-enum';
import { Fee, FeeData, RecurringFeeData } from '@/types/fee';

import { validateFeeData } from '../validators/fee';

export const formatFeeForForm = ({
    id,
    feeCategory,
    value,
    valueType,
    termType,
    recurringMonthDay,
    recurringWeekDay,
    intervalType,
    intervalValue,
    limit,
    chargedTotal,
    accountId,
    companyId,
}: Fee): FeeData => ({
    feeId: id,
    feeCategoryId: feeCategory.id,
    value,
    valueType,
    termType,
    recurringMonthDay,
    recurringWeekDay,
    intervalType,
    intervalValue,
    limit,
    chargedTotal,
    accountId,
    companyId,
});

export const formatRecurringFeeForForm = (fee: Fee): RecurringFeeData => {
    const formattedFee = formatFeeForForm(fee);

    const period = fee.recurringMonthDay ? FeePeriod.MONTHLY : fee.recurringWeekDay ? FeePeriod.WEEKLY : undefined;

    return {
        ...formattedFee,
        ...(period && { period }),
    };
};

export const filterValidFeeDataList = (fees: unknown[]): FeeData[] => fees.map(fee => validateFeeData(fee)).filter((fee): fee is FeeData => !!fee);
