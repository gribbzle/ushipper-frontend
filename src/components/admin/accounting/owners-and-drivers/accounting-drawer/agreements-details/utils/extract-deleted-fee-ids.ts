import { FeeData, RecurringFeeData } from '@/types/fee';

/**
 * Combines delayed and instant fees and extracts deleted fee IDs.
 * @param fees An object containing arrays of delayedFees and instantFees.
 * @returns An array of fee IDs.
 */

export const extractDeletedFeeIds = (fees?: { delayedFees?: FeeData[]; instantFees?: FeeData[]; recurringFees?: RecurringFeeData[] }): number[] => {
    const delayedFees = fees?.delayedFees || [];
    const instantFees = fees?.instantFees || [];
    const recurringFees = fees?.recurringFees || [];

    const combinedFees = [...delayedFees, ...instantFees, ...recurringFees];
    const deletedFees = combinedFees.map(fee => fee.feeId).filter(Boolean) as number[];

    return deletedFees;
};
