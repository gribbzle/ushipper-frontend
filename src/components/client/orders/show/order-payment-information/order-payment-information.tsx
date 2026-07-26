import React from 'react';

import { useHasPartnerCompanies, useIsPartnerCompany, useMeAdmin, useMeCarrier, useMeDriverRelated } from '@hooks';
import { OrderProvider } from '@providers';
import { useAppSelector } from '@store';
import { orderDriverSelector, orderSelector } from '@store/client';
import { classname } from '@utils';

import { DriverRateInformation } from './driver-rate-info';
import { RateInformation } from './rate-info';
import { UshipperPayInformation } from './ushipper-pay-info';

import './order-payment-information.scss';

const cn = classname('payment-information');

export const OrderPaymentInformation = () => {
    const isMeCarrier = useMeCarrier();
    const isDriver = useMeDriverRelated();
    const isMeAdmin = useMeAdmin();
    const isPartner = useIsPartnerCompany();
    const { hasPartnerCompanies } = useHasPartnerCompanies();

    const driver = useAppSelector(orderDriverSelector);
    const order = useAppSelector(orderSelector);

    if (!order) {
        return null;
    }

    return (
        <OrderProvider value={order}>
            <div className={cn('')}>
                {hasPartnerCompanies && isDriver ? <DriverRateInformation /> : <RateInformation />}
                {isPartner && driver && isMeCarrier && !isDriver && <UshipperPayInformation />}
                {isMeAdmin && driver && <UshipperPayInformation />}
            </div>
        </OrderProvider>
    );
};
