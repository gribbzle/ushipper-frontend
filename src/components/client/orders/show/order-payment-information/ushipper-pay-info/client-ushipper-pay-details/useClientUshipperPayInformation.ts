import { useMemo } from 'react';

import { useOrderHelpers } from '@/hooks/order/useOrderHelpers';
import { useOrderPaymentInformationHelpers } from '@/hooks/order/useOrderPaymentInformationHelpers';

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
