import { useMemo } from 'react';
import randomColor from 'randomcolor';

import { ColorValueHex } from '@/shared';
import { OrderColors, TrackingMapPoint, UserTracking } from '@store/client';

const COLORS_OF_FIRST_FIVE_ORDERS: ColorValueHex[] = ['#6284FF', '#F178B6', '#6FCF97', '#F7CE68', '#C6A8E3'];

export const useTrackingOrderColors = (data: UserTracking[] | undefined) => {
    return useMemo<OrderColors>(() => {
        if (!data) {
            return [];
        }

        return data.reduce<OrderColors>((acc, trackingItem) => {
            const orderColorsForItem = trackingItem.orders.map((order, index) => ({
                orderId: order.publicId,
                orderColor:
                    index < COLORS_OF_FIRST_FIVE_ORDERS.length ? COLORS_OF_FIRST_FIVE_ORDERS[index] : (randomColor({ luminosity: 'bright' }) as ColorValueHex),
            }));

            return [...acc, ...orderColorsForItem];
        }, []);
    }, [data]);
};

export const getTrackingDisplayedPathsOnMap = (
    data: UserTracking[] | undefined,
    selectedDriverId: string | null,
    selectedOrderId: string | null,
): TrackingMapPoint[] => {
    const currentUserTracking = data?.find(el => el.user.publicId === selectedDriverId);

    if (!currentUserTracking) return [];

    const ordersPointsToSort: TrackingMapPoint[] = [];

    currentUserTracking.orders
        .filter(order => {
            return (
                order.pickupInformation?.geoLatitude &&
                order.pickupInformation?.geoLongitude &&
                order.deliveryInformation?.geoLatitude &&
                order.deliveryInformation?.geoLongitude &&
                (!selectedOrderId || selectedOrderId === order.publicId)
            );
        })
        .forEach(order => {
            ordersPointsToSort.push({
                pointId: `${order.publicId}-pickup`,
                needTobeHereAt: new Date(order.pickupInformation.scheduledPickupAt as string),
                lat: order.pickupInformation.geoLatitude as number,
                lon: order.pickupInformation.geoLongitude as number,
                orderId: order.publicId,
                markerType: 'pickup',
                orderStatus: order.status,
            });
            ordersPointsToSort.push({
                pointId: `${order.publicId}-delivery`,
                needTobeHereAt: new Date(order.deliveryInformation.scheduledDeliveryAt as string),
                lat: order.deliveryInformation.geoLatitude as number,
                lon: order.deliveryInformation.geoLongitude as number,
                orderId: order.publicId,
                markerType: 'delivery',
                orderStatus: order.status,
            });
        });

    return ordersPointsToSort;
};

export const useTrackingDisplayedPathsOnMap = (data: UserTracking[] | undefined, selectedDriverId: string | null, selectedOrderId: string | null) => {
    return useMemo<TrackingMapPoint[]>(
        () => getTrackingDisplayedPathsOnMap(data, selectedDriverId, selectedOrderId),
        [data, selectedDriverId, selectedOrderId],
    );
};
