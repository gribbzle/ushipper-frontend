import { useCallback } from 'react';
import { useMap } from 'react-map-gl/mapbox';

import { OrderStatus } from '@enums';
import { useAppSelector } from '@store';
import { Driver, fetchedIsDriversListShownSelector, OrderCoordinate, OrderTracking } from '@store/client';
import { Coordinate, DirectionsResponse, Geo, Location, TripsResponse } from '@types';
import { axios, pointsToBounds } from '@utils';

const PADDING_VERTICAL = 100;
const PADDING_HORIZONTAL = 40;
const PADDING_SIDE_EXPANDED = 380;
const FIT_BOUNDS_DURATION = 1000;

enum MAPBOX_ROUTING_PROFILE {
    DRIVING = 'mapbox/driving',
}

export const useTracking = () => {
    const { current: map } = useMap();
    const isDriversListShown = useAppSelector(fetchedIsDriversListShownSelector);

    const fitBounds = useCallback(
        (bounds: [number, number, number, number]): void => {
            map?.fitBounds(bounds, {
                padding: {
                    top: PADDING_VERTICAL,
                    left: isDriversListShown ? PADDING_SIDE_EXPANDED : PADDING_HORIZONTAL,
                    bottom: PADDING_VERTICAL,
                    right: PADDING_HORIZONTAL,
                },
                duration: FIT_BOUNDS_DURATION,
            });
        },
        [isDriversListShown, map],
    );

    const addDriverCoordinates = useCallback((coords: Coordinate[], { latestLocation }: Driver): void => {
        if (!latestLocation) {
            return;
        }

        const { geoLongitude: longitude, geoLatitude: latitude } = latestLocation;

        coords.push({ longitude, latitude });
    }, []);

    const addOrderPickupLocation = useCallback((coords: Coordinate[], location: Location, status: OrderStatus, shouldConsiderOrderStatus?: boolean): void => {
        if ((shouldConsiderOrderStatus && status === OrderStatus.NEW) || !shouldConsiderOrderStatus) {
            coords.push(location);
        }
    }, []);

    const addOrderDeliveryLocation = useCallback((coords: Coordinate[], location: Location, status: OrderStatus, shouldConsiderOrderStatus?: boolean): void => {
        if ((shouldConsiderOrderStatus && status !== OrderStatus.DELIVERED) || !shouldConsiderOrderStatus) {
            coords.push(location);
        }
    }, []);

    const addOrderCoordinates = useCallback(
        (coords: Coordinate[], order: OrderTracking, shouldConsiderOrderStatus?: boolean): void => {
            const { status, pickupInformation, deliveryInformation } = order;
            const { geoLongitude: pickupLongitude, geoLatitude: pickupLatitude } = pickupInformation;

            if (!pickupLongitude || !pickupLatitude) {
                return;
            }

            const { geoLongitude: deliveryLongitude, geoLatitude: deliveryLatitude } = deliveryInformation;

            if (!deliveryLongitude || !deliveryLatitude) {
                return;
            }

            const pickupLocation: Location = { latitude: pickupLatitude, longitude: pickupLongitude };
            const deliveryLocation: Location = { latitude: deliveryLatitude, longitude: deliveryLongitude };

            addOrderPickupLocation(coords, pickupLocation, status, shouldConsiderOrderStatus);
            addOrderDeliveryLocation(coords, deliveryLocation, status, shouldConsiderOrderStatus);
        },
        [addOrderDeliveryLocation, addOrderPickupLocation],
    );

    const fitBoundsToOrderRoute = useCallback(
        (driver: Driver, order: OrderTracking): void => {
            const coords: Coordinate[] = [];

            addDriverCoordinates(coords, driver);
            addOrderCoordinates(coords, order);

            const bounds = pointsToBounds(coords);

            if (coords.length > 1) {
                fitBounds(bounds);
            }
        },
        [addDriverCoordinates, addOrderCoordinates, fitBounds],
    );

    const fitBoundsToOrdersRoute = useCallback(
        (driver: Driver, orders: OrderTracking[]): void => {
            const coords: Coordinate[] = [];

            addDriverCoordinates(coords, driver);

            orders.forEach((order): void => {
                addOrderCoordinates(coords, order);
            });

            const bounds = pointsToBounds(coords);

            if (coords.length > 1) {
                fitBounds(bounds);
            }
        },
        [addDriverCoordinates, addOrderCoordinates, fitBounds],
    );

    const flyToDriver = useCallback(
        ({ latestLocation }: Driver): void => {
            if (!latestLocation) {
                return;
            }

            const { geoLongitude, geoLatitude } = latestLocation;

            map?.flyTo({
                center: [geoLongitude, geoLatitude],
                zoom: 7,
            });
        },
        [map],
    );

    const formatCoordinatesString = (coordinates: Coordinate[]): string =>
        coordinates
            .map(({ longitude, latitude }): string => `${longitude},${latitude}`)
            .join(';')
            .slice(0, -1);

    const retrieveDirections = useCallback((profile: MAPBOX_ROUTING_PROFILE, coordinates: Coordinate[]): string => {
        const coordinatesString = formatCoordinatesString(coordinates);

        return `https://api.mapbox.com/directions/v5/${profile}/${coordinatesString}`;
    }, []);

    const retrieveOptimizedTrips = useCallback((profile: MAPBOX_ROUTING_PROFILE, coordinates: string[]): string => {
        return `https://api.mapbox.com/optimized-trips/v1/${profile}/${coordinates.join(';')}`;
    }, []);

    const getDirection = useCallback(
        async (coordinates: Coordinate[]): Promise<Geo | undefined> => {
            const url = retrieveDirections(MAPBOX_ROUTING_PROFILE.DRIVING, coordinates);

            try {
                const response = await axios.get<DirectionsResponse>(url, {
                    params: {
                        geometries: 'geojson',
                        access_token: process.env.mapboxToken,
                    },
                });

                return {
                    type: 'Feature',
                    geometry: response.data.routes[0].geometry,
                    properties: {
                        waypoints: response.data.waypoints.slice(1),
                    },
                };
            } catch (error) {
                console.error('Error querying Directions API:', error);
            }
        },
        [retrieveDirections],
    );

    function generateDistributions(num: number): string {
        const result: string[] = [];

        for (let i = 1; i < num; i++) {
            const start = i * 2;
            const end = start + 1;

            result.push(`${start},${end}`);
        }

        return result.join(';');
    }

    const getOptimizedTrips = useCallback(
        async (orders: OrderTracking[]): Promise<Geo | undefined> => {
            const points: string[] = [];

            const sortedOrders = [...orders].sort((a, b): number => {
                if (a.status === OrderStatus.PICKED_UP && b.status !== OrderStatus.PICKED_UP) {
                    return -1;
                }

                if (a.status !== OrderStatus.PICKED_UP && b.status === OrderStatus.PICKED_UP) {
                    return 1;
                }

                if (a.status === OrderStatus.PICKED_UP && b.status === OrderStatus.PICKED_UP) {
                    return new Date(a.pickedUpAt ?? '').getTime() - new Date(b.pickedUpAt ?? '').getTime();
                }

                return 0;
            });

            sortedOrders.forEach(order => {
                points.push(`${order.pickupInformation.geoLongitude},${order.pickupInformation.geoLatitude}`);
                points.push(`${order.deliveryInformation.geoLongitude},${order.deliveryInformation.geoLatitude}`);
            });

            const url = retrieveOptimizedTrips(MAPBOX_ROUTING_PROFILE.DRIVING, points);
            const distributions = generateDistributions(points.length / 2);

            try {
                const response = await axios.get<TripsResponse>(url, {
                    params: {
                        geometries: 'geojson',
                        distributions,
                        source: 'first',
                        destination: 'last',
                        roundtrip: false,
                        access_token: process.env.mapboxToken,
                    },
                });

                const geometry = {
                    ...response.data.trips[0].geometry,
                    coordinates: response.data.trips[0].geometry.coordinates,
                };

                return {
                    type: 'Feature',
                    geometry,
                    properties: {
                        waypoints: response.data.waypoints,
                    },
                };
            } catch (error) {
                console.error('Error querying Directions API:', error);
            }
        },
        [retrieveOptimizedTrips],
    );

    const getOptimizeRoute = useCallback(
        async (orders: OrderCoordinate[]): Promise<Geo | undefined> => {
            const coords: Coordinate[] = [];

            orders.forEach(({ geoLatitude, geoLongitude }): void => {
                coords.push({ latitude: geoLatitude, longitude: geoLongitude });
            });

            return getDirection(coords);
        },
        [getDirection],
    );

    return {
        fitBoundsToOrderRoute,
        fitBoundsToOrdersRoute,
        flyToDriver,
        getDirection,
        getOptimizeRoute,
        getOptimizedTrips,
    };
};
