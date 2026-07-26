import React, { useMemo } from 'react';

import { useOrderPaymentTerms } from '@/hooks/order';
import { OrderDriverPaymentFormAlert } from '@components';
import { OrderStatus } from '@enums';
import { useHasPartnerCompanies, useMeDriverRelated } from '@hooks';
import { useAppSelector } from '@store';
import { orderSelector } from '@store/client';
import { Paper } from '@ui';

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
