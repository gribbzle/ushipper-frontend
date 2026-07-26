import { useMemo } from 'react';

import { FeeCategoryTermType } from '@enums';
import { calculateTotalFees, formatToCurrency } from '@utils';

import { useOrder } from './useOrder';
import { useOrderPaymentInformationHelpers } from './useOrderPaymentInformationHelpers';

export const useOrderFees = () => {
    const { delayedTotalPayment, instantTotalPayment, preparedBrokerFee } = useOrderPaymentInformationHelpers();
    const { accounting } = useOrder();

    const usedFees = useMemo(() => accounting?.usedFees, [accounting?.usedFees]);
    const delayedFees = useMemo(() => usedFees?.filter(fee => fee.termType === FeeCategoryTermType.DELAYED) || [], [usedFees]);
    const instantFees = useMemo(() => usedFees?.filter(fee => fee.termType === FeeCategoryTermType.INSTANT) || [], [usedFees]);
    const instantTotalFees = useMemo(() => calculateTotalFees(instantFees, instantTotalPayment), [instantFees, instantTotalPayment]);
    const delayedTotalFees = useMemo(() => calculateTotalFees(delayedFees, delayedTotalPayment), [delayedFees, delayedTotalPayment]);

    const totalFeesAmount = useMemo(() => {
        if (!usedFees) {
            return null;
        }

        return formatToCurrency(instantTotalFees + delayedTotalFees + preparedBrokerFee);
    }, [preparedBrokerFee, delayedTotalFees, instantTotalFees, usedFees]);

    return {
        totalFeesAmount,
        usedFees,
        delayedFees,
        instantFees,
    };
};
