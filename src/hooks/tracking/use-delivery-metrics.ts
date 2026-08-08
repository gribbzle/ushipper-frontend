import { useMemo } from 'react';

import { isNumber } from '@/shared';
import { ShipperTrackingOrder } from '@store/client';
import { LatestLocation } from '@store/client/tracking/location-types';
import { isTrackingOrderPickedUp } from '@utils/tracking/shipper-tracking-order-helpers';

import { useDrivingMetrics } from './use-driving-metrics';

type UseDeliveryMetricsProps = {
    order: ShipperTrackingOrder | null;
    latestLocation?: LatestLocation | null;
    averageSpeed?: number | null;
};

export const useDeliveryMetrics = ({ order, latestLocation, averageSpeed }: UseDeliveryMetricsProps) => {
    const { pickupInformation, deliveryInformation } = order || {};

    const isOrderPickedUp = order && isTrackingOrderPickedUp(order);

    // Metrics to the pickup point
    const {
        time: toPickupTime,
        drivingDistance: toPickupDistance,
        loading: loadingToPickup,
    } = useDrivingMetrics(latestLocation, pickupInformation, averageSpeed);

    // Metrics from the driver's current location to the delivery point
    const {
        time: toDeliveryTimeFromDriver,
        drivingDistance: toDeliveryDistanceFromDriver,
        loading: loadingToDeliveryFromDriver,
    } = useDrivingMetrics(latestLocation, deliveryInformation, averageSpeed);

    //  Metrics from the pickup point to the delivery point
    const {
        time: toDeliveryTimeFromPickup,
        drivingDistance: toDeliveryDistanceFromPickup,
        loading: loadingToDeliveryFromPickup,
    } = useDrivingMetrics(pickupInformation, deliveryInformation, averageSpeed);

    const result = useMemo(() => {
        let totalTime = null;
        let totalDistance = null;
        let loading = false;

        if (isOrderPickedUp) {
            // If the order is picked up, calculate time and distance from the driver's location to the delivery point
            totalTime = toDeliveryTimeFromDriver;
            totalDistance = toDeliveryDistanceFromDriver;
            loading = loadingToDeliveryFromDriver;
        } else if (isNumber(toPickupTime) && isNumber(toDeliveryTimeFromPickup) && isNumber(toPickupDistance) && isNumber(toDeliveryDistanceFromPickup)) {
            // If the order is not picked up, calculate the sum of:
            // 1. Time and distance to the pickup point.
            // 2. Time and distance from the pickup point to the delivery point.
            totalTime = toPickupTime + toDeliveryTimeFromPickup;
            totalDistance = toPickupDistance + toDeliveryDistanceFromPickup;
            loading = loadingToPickup || loadingToDeliveryFromPickup;
        }

        return {
            totalTime,
            totalDistance,
            loading,
        };
    }, [
        isOrderPickedUp,
        toPickupTime,
        toDeliveryTimeFromPickup,
        toPickupDistance,
        toDeliveryDistanceFromPickup,
        toDeliveryTimeFromDriver,
        toDeliveryDistanceFromDriver,
        loadingToPickup,
        loadingToDeliveryFromPickup,
        loadingToDeliveryFromDriver,
    ]);

    return { ...result, toPickupDistance, toDeliveryDistanceFromDriver };
};
