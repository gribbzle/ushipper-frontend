import React, { useEffect, useMemo, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapRef, Marker } from 'react-map-gl/mapbox';

import { OrderStatus } from '@/enums/order-status';
import { isNumber } from '@/shared';
import { formatDrivingDistance } from '@/utils/driving';
import { getDistanceMatrix } from '@api';
import { useDeliveryMetrics } from '@/hooks/tracking/use-delivery-metrics';
import { useShipperTrackingDriver } from '@/hooks/tracking/use-shipper-tracking-driver';
import { useAppSelector } from '@store';
import { selectedShipperTrackingOrderSelector, TrackingMapPoint } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { createTrackingMapPoint, getDeliveryPoint, getDriverPoint, getPickupPoint } from '@utils/tracking/get-order-tracking-points';
import { getOrderStatusForTracking } from '@utils/tracking/map-order-status-to-tracking-order-status';
import { findOptimalPath, getPointsDistanceMatrix } from '@utils/tracking/optimal-route-finder';
import { isTrackingOrderNotDispatched } from '@utils/tracking/shipper-tracking-order-helpers';

import { DriverOrderPin, MapOrderRoute, OrderMarker, OrderPin } from '../../../common';

import { isDriverPoint, isSelectedOrderPoint } from './utils';

import './selected-order-route.scss';

type SelectedOrderRouteProps = {
    mapRef: React.RefObject<MapRef>;
    bounds: mapboxgl.LngLatBounds;
};

// const defaultColor = '#4F76FF';
// const ROUTE_COLORS: ColorValueHex[] = [defaultColor, '#b5b5c3'];

const t = translateByNamespace('client:tracking-page:order-pin');
const cn = classname('selected-order-route');

export const SelectedOrderRoute = ({ mapRef, bounds }: SelectedOrderRouteProps) => {
    const selectedOrder = useAppSelector(selectedShipperTrackingOrderSelector);

    const isOrderNotDispatched = selectedOrder && isTrackingOrderNotDispatched(selectedOrder);
    // const isOrderPickedUp = selectedOrder && isTrackingOrderPickedUp(selectedOrder);

    const { driver, latestLocation, averageSpeed } = useShipperTrackingDriver();

    const { totalTime, totalDistance, loading } = useDeliveryMetrics({
        order: selectedOrder,
        latestLocation,
        averageSpeed,
    });

    const driverMarker = useMemo(() => {
        if (!driver || isOrderNotDispatched) {
            return null;
        }

        const driverLatitude = latestLocation?.geoLatitude;
        const driverLongitude = latestLocation?.geoLongitude;

        return (
            driverLatitude &&
            driverLongitude && (
                <Marker style={{ zIndex: 1 }} latitude={driverLatitude} longitude={driverLongitude} anchor='bottom'>
                    <DriverOrderPin driver={driver} isDisabled={true} className={cn('driver', { view: getOrderStatusForTracking(selectedOrder) })} />
                </Marker>
            )
        );
    }, [driver, latestLocation, selectedOrder, isOrderNotDispatched]);

    const deliveryText = useMemo<string | undefined>(() => {
        if (!driver || loading) {
            return undefined;
        }

        return isNumber(totalTime)
            ? t('delivery-in-label', { time: totalTime, miles: formatDrivingDistance(totalDistance) ?? '' })
            : t('insufficient-data-label', { status: t('delivery') });
    }, [driver, loading, totalTime, totalDistance]);

    const [routePoints, setRoutePoints] = useState<TrackingMapPoint[]>([]);

    useEffect(() => {
        if (!selectedOrder) {
            setRoutePoints([]);

            return;
        }

        const coordinates: [number, number][] = [];
        const allRoutePoints: TrackingMapPoint[] = [];

        if (driver) {
            const driverPoint = createTrackingMapPoint(getDriverPoint(driver));

            if (driverPoint) {
                allRoutePoints.push(driverPoint);
            }
        }

        const selectedOrderPickupPoint = createTrackingMapPoint(getPickupPoint(selectedOrder));
        const selectedOrderDeliveryPoint = createTrackingMapPoint(getDeliveryPoint(selectedOrder));

        if (selectedOrderPickupPoint && selectedOrderDeliveryPoint) {
            allRoutePoints.push(selectedOrderPickupPoint, selectedOrderDeliveryPoint);
        }

        driver?.orders
            .filter(order => selectedOrder.publicId !== order.publicId)
            .forEach(order => {
                const pickupPoint = createTrackingMapPoint(getPickupPoint(order));
                const deliveryPoint = createTrackingMapPoint(getDeliveryPoint(order));

                if (pickupPoint && deliveryPoint && selectedOrderDeliveryPoint) {
                    const isPickupBeforeDelivery = pickupPoint.needTobeHereAt.getTime() <= selectedOrderDeliveryPoint.needTobeHereAt.getTime();
                    const isDeliveryBeforeSelectedOrderDelivery = deliveryPoint.needTobeHereAt.getTime() <= selectedOrderDeliveryPoint.needTobeHereAt.getTime();

                    if (isPickupBeforeDelivery && order.status !== OrderStatus.PICKED_UP) {
                        allRoutePoints.push(pickupPoint);
                    }

                    if (isDeliveryBeforeSelectedOrderDelivery) {
                        allRoutePoints.push(deliveryPoint);
                    }
                }
            });

        if (allRoutePoints.length < 2) {
            setRoutePoints([]);

            return;
        }

        allRoutePoints.forEach(point => {
            coordinates.push([point.lon, point.lat]);
        });

        getDistanceMatrix(coordinates)
            .then(res => {
                const responseMatrix = res.distances;
                const path = findOptimalPath(allRoutePoints, getPointsDistanceMatrix(allRoutePoints, responseMatrix));

                setRoutePoints(path);
            })
            .catch(error => {
                console.error(error);
                setRoutePoints([]);
            });
    }, [driver, selectedOrder]);

    const driverOrdersPointsOnMap = useMemo<TrackingMapPoint[]>(() => {
        if (!selectedOrder || !driver) {
            return [];
        }

        return routePoints.filter(p => !(isDriverPoint(p, driver) || isSelectedOrderPoint(p, selectedOrder)));
    }, [routePoints, selectedOrder, driver]);

    if (!selectedOrder) {
        return null;
    }

    const { deliveryInformation } = selectedOrder;

    return (
        <>
            {driverMarker}
            {driverOrdersPointsOnMap.map(point => (
                <Marker key={point.pointId} style={{ zIndex: 2 }} latitude={point.lat} longitude={point.lon} anchor='bottom'>
                    <OrderMarker hideLetters={true} borderColor='white' type='new' />
                </Marker>
            ))}

            {routePoints.map((point, index) => {
                if (index === routePoints.length - 1) return null;

                // const startPoint = point;
                // const endPoint = routePoints[index + 1];

                // let color = ROUTE_COLORS[0];

                // if (isOrderPickedUp && isDriverPoint(startPoint, driver) && isSelectedOrderPoint(endPoint, selectedOrder) && isPickupPoint(endPoint)) {
                //     color = ROUTE_COLORS[1];
                // }

                return (
                    <MapOrderRoute
                        key={`${point.pointId}-${point.markerType}-${index}`}
                        startPoint={point}
                        endPoint={routePoints[index + 1]}
                        bounds={bounds}
                        mapRef={mapRef}
                    />
                );
            })}
            {deliveryInformation.geoLatitude && deliveryInformation.geoLongitude && (
                <Marker style={{ zIndex: 2 }} latitude={deliveryInformation.geoLatitude} longitude={deliveryInformation.geoLongitude} anchor='bottom'>
                    <OrderPin status={OrderStatus.DELIVERED} isHover={false} details={deliveryText} />
                </Marker>
            )}
        </>
    );
};
