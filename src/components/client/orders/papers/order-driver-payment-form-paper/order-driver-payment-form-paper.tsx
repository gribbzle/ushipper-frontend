import React, { useMemo } from 'react';

import { OrderDriverPaymentFormAlert } from '@/components/client/orders/alerts/order-driver-payment-form-alert/order-driver-payment-form-alert';
import { useOrderPaymentTerms } from '@/hooks/order';
import { OrderStatus } from '@enums';
import { useHasPartnerCompanies, useMeDriverRelated } from '@hooks';
import { useAppSelector } from '@store';
import { orderSelector } from '@store/client';
import { Paper } from '@/components/ui/surfaces/paper';

export const OrderDriverPaymentFormPaper = () => {
    const order = useAppSelector(orderSelector);
    const { hasPartnerCompanies } = useHasPartnerCompanies();
    const isDriver = useMeDriverRelated();

    const { status, paymentInformation } = order || {};
    const { isOnlyInstantTermsOrder } = useOrderPaymentTerms({
        terms: paymentInformation?.terms,
        delayedTerms: paymentInformation?.delayedTerms,
    });

    const shouldRenderForm = useMemo(
        () => status === OrderStatus.DELIVERED && isOnlyInstantTermsOrder && isDriver && hasPartnerCompanies,
        [isOnlyInstantTermsOrder, status, isDriver, hasPartnerCompanies],
    );

    if (!shouldRenderForm) {
        return null;
    }

    return (
        <Paper>
            <OrderDriverPaymentFormAlert order={order} />
        </Paper>
    );
};
