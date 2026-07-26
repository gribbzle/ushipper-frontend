import React, { useMemo } from 'react';
import { format } from 'date-fns';

import { calculateTotalPayment, getPaymentPerDistanceWithoutCurrency } from '@/utils/payment';
import { CarIcon2, DollarCircleIcon, ScheduleWithoutCheckIcon } from '@icons';
import { ShipperTrackingOrder } from '@store/client';
import { classname, isFreightX, translateByNamespace } from '@utils';

import { CommoditiesTotalInfo } from '../commodities-total-info';

import './shipper-tracking-order-paper.scss';

const cn = classname('shipper-tracking-order-paper');
const t = translateByNamespace('client:tracking-page');

export const NotDispatchedOrderDetails = ({
    pickupInformation,
    deliveryInformation,
    paymentInformation,
    vehicles,
    commodities,
    drivingDistance,
}: ShipperTrackingOrder) => {
    const scheduledPickupAt = useMemo(
        () => (pickupInformation?.scheduledPickupAt ? format(new Date(pickupInformation.scheduledPickupAt), 'MMM dd') : t('no-details')),
        [pickupInformation],
    );
    const scheduledDeliveryAt = useMemo(
        () => (deliveryInformation?.scheduledDeliveryAt ? format(new Date(deliveryInformation.scheduledDeliveryAt), 'MMM dd') : t('no-details')),
        [deliveryInformation],
    );

    return (
        <>
            <div className={cn('value')}>
                <ScheduleWithoutCheckIcon />
                <h4>
                    {pickupInformation?.scheduledPickupAt || deliveryInformation?.scheduledDeliveryAt ? (
                        <>
                            {scheduledPickupAt} - {scheduledDeliveryAt}
                        </>
                    ) : (
                        t('no-details')
                    )}
                </h4>
            </div>
            <div className={cn('value')}>
                {isFreightX ? (
                    <CommoditiesTotalInfo commodities={commodities ?? []} isFull={false} showLabel={false} showIcon={true} />
                ) : (
                    <>
                        <CarIcon2 /> <h4>{vehicles?.length ?? 0}</h4>
                    </>
                )}
            </div>
            {paymentInformation && (
                <div className={cn('value')}>
                    <DollarCircleIcon />
                    <h4>
                        {drivingDistance ? getPaymentPerDistanceWithoutCurrency(calculateTotalPayment(paymentInformation), drivingDistance) : t('no-details')}
                    </h4>
                </div>
            )}
        </>
    );
};
