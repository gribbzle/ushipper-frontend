import { useMemo } from 'react';

import { useOrderHelpers, useOrderPaymentInformationHelpers } from '@/hooks/order';

export const useClientUshipperPayInformation = () => {
    const { receiptlessOrder } = useOrderHelpers();
    const { isBothTermsOrder, isOnlyInstantTermsOrder } = useOrderPaymentInformationHelpers();

    const showDriverChargedFeeAlert = useMemo(
        () => (isBothTermsOrder || isOnlyInstantTermsOrder) && receiptlessOrder,
        [isBothTermsOrder, isOnlyInstantTermsOrder, receiptlessOrder],
    );

    return {
        showDriverChargedFeeAlert,
    };
};
