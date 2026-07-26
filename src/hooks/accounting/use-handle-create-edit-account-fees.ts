import { FeeCategoryTermType, FeePeriod } from '@enums';
import { useCreateFeeMutation, usePathFeeMutation } from '@store/api/fee-api';
import { FeeData, RecurringFeeData } from '@types';

export const useHandleCreateEditAccountFees = () => {
    const [updateFee] = usePathFeeMutation();
    const [createFee] = useCreateFeeMutation();

    const handleCreateEditAccountFees = async ({
        accountId,
        fees,
    }: {
        accountId: string;
        fees?: {
            delayedFees?: FeeData[];
            instantFees?: FeeData[];
            recurringFees?: RecurringFeeData[];
        };
    }) => {
        if (!accountId || !fees) return;

        const combinedFees = [
            ...(fees.instantFees || []).map(fee => ({
                ...fee,
                termType: FeeCategoryTermType.INSTANT,
                accountId,
            })),
            ...(fees.delayedFees || []).map(fee => ({
                ...fee,
                termType: FeeCategoryTermType.DELAYED,
                accountId,
            })),
            ...(fees.recurringFees || []).map(({ period, recurringMonthDay, recurringWeekDay, intervalType, ...fee }) => ({
                ...fee,
                recurringMonthDay: period === FeePeriod.MONTHLY ? recurringMonthDay : null,
                recurringWeekDay: period === FeePeriod.WEEKLY ? recurringWeekDay : null,
                intervalType: intervalType ?? null,
                intervalValue: intervalType ? 1 : null,
                accountId,
            })),
        ];

        const promises = combinedFees.map(fee => (fee.feeId ? updateFee(fee).unwrap() : createFee(fee).unwrap()));

        try {
            await Promise.all(promises);
        } catch (error) {
            throw error;
        }
    };

    return handleCreateEditAccountFees;
};
