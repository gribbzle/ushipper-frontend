import React, { useMemo } from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { OrderSourcesEnum } from '@/enums';
import { getOrderPriceWithTerms, getParsedOrderPriceWithTermsAndMethods } from '@/utils/order';
import { calculateTotalPayment } from '@/utils/payment';
import { MileCostTooltip } from '@components';
import { OrderCommodity, OrderVehicle } from '@store/api/orders-api';
import { OrderPaymentInformation } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './payment-info-block.scss';

type Props = {
    paymentInformation: OrderPaymentInformation;
    drivingDistance?: number;
    source?: OrderSourcesEnum;
    vehicles: OrderVehicle[];
    commodities: OrderCommodity[];
};

const cn = classname('payment-info-block');
const t = translateByNamespace('client:loadboard:load-details');

export const PaymentInfoBlock = ({ paymentInformation, drivingDistance, source, vehicles, commodities }: Props) => {
    const { terms, delayedTerms } = paymentInformation;

    const totalAmount = useMemo(() => (paymentInformation ? calculateTotalPayment(paymentInformation) : 0), [paymentInformation]);
    const priceWithTermsAndMethods = useMemo(
        () =>
            source === OrderSourcesEnum.USHIPPER
                ? getOrderPriceWithTerms(totalAmount, [terms, delayedTerms])
                : getParsedOrderPriceWithTermsAndMethods(totalAmount, paymentInformation),
        [source, totalAmount, terms, delayedTerms, paymentInformation],
    );

    return totalAmount > 0 && (terms || delayedTerms) ? (
        <OrderItemInfoColumn title={t('payment')}>
            <div className={cn('')}>
                <span className={cn('price')}>{priceWithTermsAndMethods}</span>
                <MileCostTooltip
                    drivingDistance={drivingDistance}
                    paymentInformation={paymentInformation}
                    vehicles={vehicles}
                    commodities={commodities}
                    classNameTitle={cn('payment-per-distance')}
                />
            </div>
        </OrderItemInfoColumn>
    ) : null;
};
