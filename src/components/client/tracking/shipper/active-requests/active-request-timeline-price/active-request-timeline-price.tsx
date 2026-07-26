import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';

import { calculateTotalPayment } from '@/utils/payment';
import { Ellipse } from '@icons';
import { OrderRequest } from '@store/api/order-requests-api';
import { ShipperTrackingOrder } from '@store/client';
import { classname, formatToCurrency } from '@utils';

import './active-request-timeline-price.scss';

type ActiveRequestTimelinePriceProps = {
    request: OrderRequest;
    order: ShipperTrackingOrder;
};

const cn = classname('active-request-timeline-price');

export const ActiveRequestTimelinePrice = ({ request, order }: ActiveRequestTimelinePriceProps) => {
    const { paymentPrice, pickupAt, deliveryAt } = request;

    const {
        pickupInformation: { scheduledPickupAt: orderPickupDate },
        deliveryInformation: { scheduledDeliveryAt: orderDeliveryDate },
        paymentInformation,
    } = order;

    const warning = useCallback((date1: string, date2: string) => format(new Date(date1), 'MMM dd') !== format(new Date(date2), 'MMM dd'), []);

    const pickupWarning = useMemo(() => orderPickupDate !== null && warning(pickupAt, orderPickupDate), [orderPickupDate, pickupAt, warning]);
    const deliveryWarning = useMemo(() => orderDeliveryDate !== null && warning(deliveryAt, orderDeliveryDate), [orderDeliveryDate, deliveryAt, warning]);
    const totalAmount = useMemo(() => calculateTotalPayment(paymentInformation), [paymentInformation]);

    return (
        <div className={cn('')}>
            <span className={cn('date', { warning: pickupWarning })}>{format(new Date(pickupAt), 'MMM dd')}</span>
            <span className={cn('date', { warning: pickupWarning })}>-</span>
            <span className={cn('date', { warning: deliveryWarning })}>{format(new Date(deliveryAt), 'MMM dd')}</span>
            <Ellipse width={4} height={4} className={cn('ellipse', { warning: paymentPrice > totalAmount })} />{' '}
            {paymentPrice && totalAmount && <span className={cn('date', { warning: paymentPrice > totalAmount })}>{formatToCurrency(paymentPrice)}</span>}
        </div>
    );
};
