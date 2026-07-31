import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import type { MapRef } from 'react-map-gl/mapbox';

import { useAppDispatch, useAppSelector } from '@store';
import {
    fetchedSelectedDriverIdSelector,
    isShipperOrdersListShownSelector,
    selectedShipperTrackingOrderSelector,
    ShipperTrackingOrder,
    trackingActions,
    TrackingDriver,
} from '@store/client';

import { OrdersTrackingMapProps } from './orders-tracking-map.types';

export const useOrdersTrackingMap = ({ orders }: OrdersTrackingMapProps) => {
    const mapRef = useRef<MapRef>(null);
    const dispatch = useAppDispatch();
    const isOrdersListShown = useAppSelector(isShipperOrdersListShownSelector);
    const selectedDriverId = useAppSelector(fetchedSelectedDriverIdSelector);
    const selectedOrder = useAppSelector(selectedShipperTrackingOrderSelector);

    const [driverPaperCoordinates, setDriverPaperCoordinates] = useState<{ lat: number; lng: number } | null>(null);
    const [driverPaperPosition, setDriverPaterPosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        dispatch(trackingActions.setSelectedDriverId(selectedOrder?.driver?.publicId ?? null));
    }, [selectedOrder, dispatch]);

    const handleOrderMarkerClick = useCallback(
        (order: ShipperTrackingOrder) => {
            if (isOrdersListShown) return null;

            dispatch(trackingActions.setSelectedShipperTrackingOrder(order));
            dispatch(trackingActions.setSelectedActiveRequest(null));
        },
        [dispatch, isOrdersListShown],
    );

    const handleDriverTruckMarkerClick = useCallback(
        (driver: TrackingDriver) => {
            const { publicId, latestLocation } = driver;
            const isSelected = selectedDriverId === publicId;

            dispatch(trackingActions.setSelectedDriverId(isSelected ? null : publicId));
            dispatch(trackingActions.setSelectedActiveRequest(null));

            if (latestLocation) {
                const { geoLongitude, geoLatitude } = latestLocation;

                setDriverPaperCoordinates(isSelected ? null : { lat: geoLatitude, lng: geoLongitude });
            } else {
                setDriverPaperCoordinates(null);
            }
        },
        [dispatch, selectedDriverId],
    );
    const bounds = useMemo(() => new mapboxgl.LngLatBounds([-124.736342, 24.521208], [-66.945392, 49.382808]), []);

    useEffect(() => {
        if (mapRef.current) {
            const map = mapRef.current;

            const handleZoomAndBounds = <T>(
                items: T[],
                getCoordinates: (item: T) => { geoLatitude: number | null; geoLongitude: number | null } | undefined,
            ) => {
                if (items.length === 1) {
                    const { geoLatitude, geoLongitude } = getCoordinates(items[0]) || {};

                    if (geoLatitude && geoLongitude) {
                        map.getMap().flyTo({
                            center: [geoLongitude, geoLatitude],
                            zoom: 4,
                        });
                    }

                    return;
                }

                items.forEach(item => {
                    const { geoLatitude, geoLongitude } = getCoordinates(item) || {};

                    if (geoLatitude && geoLongitude) {
                        bounds.extend([geoLongitude, geoLatitude]);
                    }
                });

                map.fitBounds(bounds, { padding: 120 });
            };

            if (orders && orders.length !== 0) {
                handleZoomAndBounds(orders, order => order.pickupInformation);

                return;
            }
        }
    }, [bounds, orders]);

    useEffect(() => {
        if (driverPaperCoordinates && mapRef.current) {
            const map = mapRef.current.getMap();
            const { lat, lng } = driverPaperCoordinates;
            const screenCoords = map.project([lng, lat]);

            setDriverPaterPosition({
                x: screenCoords.x,
                y: screenCoords.y,
            });
            const handleMapMove = () => {
                const newScreenCoords = map.project([lng, lat]);

                setDriverPaterPosition({
                    x: newScreenCoords.x,
                    y: newScreenCoords.y,
                });
            };

            // Обновляем позицию карточки при изменении карты
            map.on('move', handleMapMove);

            return () => {
                map.off('move', handleMapMove);
            };
        }
    }, [driverPaperCoordinates]);

    return { mapRef, bounds, driverPaperPosition, isOrdersListShown, handleOrderMarkerClick, handleDriverTruckMarkerClick };
};
