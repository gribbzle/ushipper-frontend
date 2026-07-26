import React, { useCallback, useMemo } from 'react';

import { Button, Paper } from '@/components/common';
import { getOrderId } from '@/utils/order';
import { calculateTotalPayment } from '@/utils/payment';
import { useAppSelector } from '@store';
import { selectedShipperTrackingOrderSelector } from '@store/client';
import {
    classname,
    formatToCurrency,
    getTrackingOrderStatusTranslate,
    isTrackingOrderNotDispatched,
    isTrackingOrderPickedUp,
    mapOrderStatusToTrackingStatus,
    translateByNamespace,
} from '@utils';

import { ActiveRequests } from '../active-requests';
import { ShipperTrackingOrderRoute } from '../shipper-tracking-order-route';
import { ShipperOrderTag } from '../shipper-tracking-order-tag';
import { TrackingDriverInfo } from '../tracking-driver-info';

import { DispatchedOrPickedUpOrderDetails } from './dispatched-order-details';
import { NotDispatchedOrderDetails } from './not-dispatched-order-details';

import './shipper-tracking-order-paper.scss';

const cn = classname('shipper-tracking-order-paper');
const t = translateByNamespace('client:tracking-page:shipper-orders-list-paper');
const tNoDetails = translateByNamespace('client:tracking-page');
const tActions = translateByNamespace('client:tracking-page:shipper-tracking-order-paper');

export const ShipperTrackingOrderPaper = () => {
    const order = useAppSelector(selectedShipperTrackingOrderSelector);
    const { publicId, pickupInformation, deliveryInformation, paymentInformation, driver } = order || {};

    const handleOrderDetailsClick = useCallback(() => {
        if (publicId) {
            window.open(`/orders/${publicId}`, '_blank');
        }
    }, [publicId]);

    const body = useMemo(() => {
        if (!order) return null;

        const view = mapOrderStatusToTrackingStatus(order.status);
        const isOrderPickedUp = isTrackingOrderPickedUp(order);
        const isOrderNotDispatched = isTrackingOrderNotDispatched(order);

        return (
            <div className={cn('body')}>
                <div className={cn('row')}>
                    <div className={cn('title')}>
                        <p>
                            {t('order-id')}: {getOrderId(order)}
                        </p>
                        <ShipperOrderTag view={view} showIcon={true}>
                            {getTrackingOrderStatusTranslate(view)}
                        </ShipperOrderTag>
                    </div>
                    <div className={cn('row', { flex: true })}>
                        {isOrderNotDispatched && <ActiveRequests order={order} onTop={true} />}
                        {driver && (
                            <TrackingDriverInfo
                                userName={driver.name}
                                companyName={driver.companyName}
                                rating={driver.rating}
                                avatar={driver.avatar}
                                showLike={driver.isFlagged}
                                orderPublicId={order.publicId}
                            />
                        )}
                        <span className={cn('price')}>
                            {formatToCurrency(paymentInformation ? calculateTotalPayment(paymentInformation) : tNoDetails('no-details'))}
                        </span>
                    </div>
                </div>

                <div className={cn('row')}>
                    <ShipperTrackingOrderRoute pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} showTruck={isOrderPickedUp} />
                    <div className={cn('row', { flex: true })}>
                        <div className={cn('details')}>
                            {isOrderNotDispatched ? <NotDispatchedOrderDetails {...order} /> : <DispatchedOrPickedUpOrderDetails order={order} />}
                        </div>

                        <div className={cn('actions')}>
                            <Button view='primary' size='medium' plain={true} onClick={handleOrderDetailsClick}>
                                {tActions('details')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [order, driver, paymentInformation, pickupInformation, deliveryInformation, handleOrderDetailsClick]);

    if (!order) {
        return null;
    }

    return <Paper body={body} className={cn()} bodyClassName={cn('no-padding')} />;
};
