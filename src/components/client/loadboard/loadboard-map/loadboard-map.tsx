import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { Map, MapRef, Marker } from 'react-map-gl/mapbox';

import { InspectionSubtype, LoadboardTab } from '@enums';
import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';
import { classname } from '@utils';

import { LoadboardList } from '../loadboard-list';

import { LoadboardMapRoute } from './loadboard-map-route';
import { LoadboardMarker } from './loadboard-marker';

import './loadboard-map.scss';

const cn = classname('map-container');

type Props = {
    orders: Load[];
    searchParams: ReadonlyURLSearchParams;
    selectedTab: LoadboardTab;
    loadBoardFilters: LoadBoardFilters;
};

export const LoadboardMap = ({ orders, searchParams, selectedTab, loadBoardFilters }: Props) => {
    const [chosenOrders, setChosenOrders] = useState<Load[]>();

    const handleChooseOrders = useCallback(
        (order: Load, type: InspectionSubtype) => {
            const newOrders = orders.filter(item => {
                if (type === InspectionSubtype.DELIVERY) {
                    return (
                        (order.deliveryInformation.geoLatitude === item.deliveryInformation.geoLatitude &&
                            order.deliveryInformation.geoLongitude === item.deliveryInformation.geoLongitude) ||
                        (order.deliveryInformation.geoLatitude === item.pickupInformation.geoLatitude &&
                            order.deliveryInformation.geoLongitude === item.pickupInformation.geoLongitude)
                    );
                }

                return (
                    (order.pickupInformation.geoLatitude === item.deliveryInformation.geoLatitude &&
                        order.pickupInformation.geoLongitude === item.deliveryInformation.geoLongitude) ||
                    (order.pickupInformation.geoLatitude === item.pickupInformation.geoLatitude &&
                        order.pickupInformation.geoLongitude === item.pickupInformation.geoLongitude)
                );
            });

            setChosenOrders(newOrders);
        },
        [setChosenOrders, orders],
    );

    const mapRef = useRef<MapRef>(null);

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.resize();
        }
    }, [searchParams, selectedTab]);

    const bounds = useMemo(() => new mapboxgl.LngLatBounds([-124.736342, 24.521208], [-66.945392, 49.382808]), []);

    useEffect(() => {
        orders.forEach(order => {
            order.pickupInformation.geoLongitude &&
                order.pickupInformation.geoLatitude &&
                bounds.extend([order.pickupInformation.geoLongitude, order.pickupInformation.geoLatitude]);

            order.deliveryInformation.geoLongitude &&
                order.deliveryInformation.geoLatitude &&
                bounds.extend([order.deliveryInformation.geoLongitude, order.deliveryInformation.geoLatitude]);

            if (mapRef.current) {
                mapRef.current.fitBounds(bounds, { padding: 80 });
            }
        });
    }, [orders, mapRef.current, bounds]);

    useEffect(() => {
        if (chosenOrders) {
            const newOrders = orders.filter(order => chosenOrders.some(item => item.publicId === order.publicId));

            setChosenOrders(newOrders);
        }
    }, [orders]);

    const markers = useMemo(
        () =>
            orders.map(order => {
                const pickupLatitude = order.pickupInformation.geoLatitude;
                const pickupLongitude = order.pickupInformation.geoLongitude;

                const deliveryLatitude = order.deliveryInformation.geoLatitude;
                const deliveryLongitude = order.deliveryInformation.geoLongitude;

                return (
                    <React.Fragment key={order.publicId}>
                        {pickupLatitude && pickupLongitude && (
                            <Marker latitude={pickupLatitude} longitude={pickupLongitude} anchor='center'>
                                <LoadboardMarker type={InspectionSubtype.PICKUP} order={order} chooseOrders={handleChooseOrders} />
                            </Marker>
                        )}
                        {deliveryLatitude && deliveryLongitude && (
                            <Marker latitude={deliveryLatitude} longitude={deliveryLongitude} anchor='center'>
                                <LoadboardMarker type={InspectionSubtype.DELIVERY} order={order} chooseOrders={handleChooseOrders} />
                            </Marker>
                        )}
                    </React.Fragment>
                );
            }),
        [orders, handleChooseOrders],
    );

    return (
        <div className={cn('')}>
            <div className={cn('map')}>
                <Map
                    initialViewState={{ bounds }}
                    ref={mapRef}
                    mapboxAccessToken={process.env.mapboxToken}
                    mapStyle='mapbox://styles/mapbox/streets-v9'
                    style={{ borderRadius: 8, boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.08)' }}
                >
                    {markers}
                    <LoadboardMapRoute />
                </Map>
            </div>
            {chosenOrders && chosenOrders.length > 0 && <LoadboardList loadBoardFilters={loadBoardFilters} orders={chosenOrders} />}
        </div>
    );
};
