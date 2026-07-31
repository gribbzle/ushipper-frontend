import React from 'react';

import { Loader } from '@/components/common/loader/loader';
import { useDeliveryMetrics } from '@hooks';
import { HourGlassStartIcon, RacingTruckIcon, RoutingIcon } from '@icons';
import { ShipperTrackingOrder } from '@store/client';
import { classname } from '@utils/classname';
import { isTrackingOrderPickedUp } from '@utils/tracking/shipper-tracking-order-helpers';
import {
    getFormattedAverageSpeed,
    getFormattedDeliveryTime,
    getFormattedDrivingDistance,
    getTrackingDriverAverageSpeed,
} from '@utils/tracking/tracking-driver-helpers';

import './shipper-tracking-order-paper.scss';

type Props = {
    order: ShipperTrackingOrder;
};

const cn = classname('shipper-tracking-order-paper');

export const DispatchedOrPickedUpOrderDetails = ({ order }: Props) => {
    const { driver } = order;
    const isOrderPickedUp = order && isTrackingOrderPickedUp(order);
    const { latestLocation } = driver || {};
    const averageSpeed = driver ? getTrackingDriverAverageSpeed(driver) : null;

    const { totalTime, loading, toPickupDistance, toDeliveryDistanceFromDriver } = useDeliveryMetrics({
        order,
        latestLocation,
        averageSpeed,
    });

    if (!driver) {
        return null;
    }

    return (
        <>
            <div className={cn('value')}>
                <RacingTruckIcon />
                <h4>{getFormattedAverageSpeed(averageSpeed)}</h4>
            </div>
            <div className={cn('value')}>
                <RoutingIcon />
                <h4>{loading ? <Loader /> : getFormattedDrivingDistance(isOrderPickedUp ? toDeliveryDistanceFromDriver : toPickupDistance)}</h4>
            </div>
            <div className={cn('value')}>
                <HourGlassStartIcon />
                <h4>{loading ? <Loader /> : getFormattedDeliveryTime(totalTime)}</h4>
            </div>
        </>
    );
};
