import { useMemo } from 'react';

import { isNumber } from '@/shared';
import { calculateElapsedTime, formatDrivingDistance } from '@/utils/driving';
import { useDrivingMetrics } from '@/hooks/tracking/use-driving-metrics';
import { useShipperTrackingDriver } from '@/hooks/tracking/use-shipper-tracking-driver';
import { useAppSelector } from '@store';
import { selectedShipperTrackingOrderSelector } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { isTrackingOrderNotDispatched, isTrackingOrderPickedUp } from '@utils/tracking/shipper-tracking-order-helpers';

const t = translateByNamespace('client:tracking-page:order-pin');

const getNoDataLabel = () => t('insufficient-data-label', { status: t('pick-up') });

const getElapsedTimeText = ({ startTime, endTime }: { startTime: string | null; endTime: string | null }) => {
    const elapsedTime = calculateElapsedTime({
        startTime,
        endTime,
    });

    if (!elapsedTime) {
        return getNoDataLabel();
    }
    if (elapsedTime < 0) {
        return t('driver-location-outdated-label');
    }

    return t('picked-up-ago-label', { time: elapsedTime });
};

export const useSelectedOrderPickupText = () => {
    const selectedOrder = useAppSelector(selectedShipperTrackingOrderSelector);

    const { pickupInformation } = selectedOrder || {};

    const isOrderPickedUp = selectedOrder && isTrackingOrderPickedUp(selectedOrder);
    const isOrderNotDispatched = selectedOrder && isTrackingOrderNotDispatched(selectedOrder);

    const { driver, latestLocation, averageSpeed } = useShipperTrackingDriver();
    const { drivingDistance, time, loading } = useDrivingMetrics(latestLocation, pickupInformation, averageSpeed);

    return useMemo<string | null>(() => {
        if (!driver || !selectedOrder) {
            return null;
        }

        if (isOrderPickedUp) {
            return getElapsedTimeText({
                startTime: pickupInformation?.scheduledPickupAt ?? null,
                endTime: latestLocation?.createdAt ?? null,
            });
        }

        if (loading) {
            return null;
        }

        const key = isOrderNotDispatched ? 'can-arrive-in-label' : 'pick-up-in-label';

        return isNumber(time) ? t(key, { time, miles: formatDrivingDistance(drivingDistance) ?? '' }) : getNoDataLabel();
    }, [
        driver,
        selectedOrder,
        isOrderPickedUp,
        loading,
        isOrderNotDispatched,
        time,
        drivingDistance,
        pickupInformation?.scheduledPickupAt,
        latestLocation?.createdAt,
    ]);
};
