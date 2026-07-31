import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FeatureCollection } from 'geojson';
import mapboxgl from 'mapbox-gl';
import type { MapRef } from 'react-map-gl/mapbox';
import { Layer, Map as MapGL, Marker, Source } from 'react-map-gl/mapbox';

import { OrderMarker } from '@/components/client/tracking/common/order-marker/order-marker';
import { fetchRouteGeoJSON } from '@api';
import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { classname } from '@utils/classname';

import 'mapbox-gl/dist/mapbox-gl.css';
import './loadboard-drawer-map.scss';

const cn = classname('loadboard-drawer-map');
const defaultColor = '#409eff';

type Props = {
    className?: string;
    pickupInformation: OrderPickupInformation;
    deliveryInformation: OrderDeliveryInformation;
};

export const LoadboardDrawerMap = ({ className, deliveryInformation, pickupInformation }: Props) => {
    const [geoJSON, setGeoJSON] = useState<FeatureCollection | null>(null);

    const getGeoJSON = useCallback(async (coordinates: [number, number][]) => {
        try {
            const result = await fetchRouteGeoJSON(coordinates);
            const featureCollection: FeatureCollection = {
                type: 'FeatureCollection',
                features: [result],
            };

            setGeoJSON(featureCollection);
        } catch (e) {
            return null;
        }
    }, []);

    const pickupBounds = useMemo(
        () => ({
            longitude: pickupInformation?.geoLongitude,
            latitude: pickupInformation?.geoLatitude,
        }),
        [pickupInformation?.geoLatitude, pickupInformation?.geoLongitude],
    );

    const deliveryBounds = useMemo(
        () => ({
            longitude: deliveryInformation?.geoLongitude,
            latitude: deliveryInformation?.geoLatitude,
        }),
        [deliveryInformation?.geoLatitude, deliveryInformation?.geoLongitude],
    );

    const mapRef = useRef<MapRef>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const bounds = new mapboxgl.LngLatBounds();

        if (pickupBounds.latitude && pickupBounds.longitude && deliveryBounds.latitude && deliveryBounds.longitude) {
            bounds.extend([pickupBounds.longitude, pickupBounds.latitude]);
            bounds.extend([deliveryBounds.longitude, deliveryBounds.latitude]);

            mapRef.current?.fitBounds(bounds, { padding: 40 });

            getGeoJSON([
                [pickupBounds.longitude, pickupBounds.latitude],
                [deliveryBounds.longitude, deliveryBounds.latitude],
            ]);
        }
    }, [deliveryBounds.latitude, deliveryBounds.longitude, getGeoJSON, mapLoaded, pickupBounds.latitude, pickupBounds.longitude]);

    return (
        <div className={cn('', [className])}>
            <MapGL
                ref={mapRef}
                mapboxAccessToken={process.env.mapboxToken}
                onRender={event => event.target.resize()}
                mapStyle='mapbox://styles/mapbox/streets-v9'
                style={{ position: 'absolute' }}
                onLoad={() => setMapLoaded(true)}
            >
                {pickupBounds.latitude && pickupBounds.longitude && (
                    <Marker latitude={pickupBounds.latitude} longitude={pickupBounds.longitude}>
                        <OrderMarker type='pickup' />
                    </Marker>
                )}
                {deliveryBounds.latitude && deliveryBounds.longitude && (
                    <Marker latitude={deliveryBounds.latitude} longitude={deliveryBounds.longitude}>
                        <OrderMarker type='delivery' />
                    </Marker>
                )}
                {geoJSON && (
                    <Source type='geojson' data={geoJSON}>
                        <Layer type='line' paint={{ 'line-color': defaultColor, 'line-width': 7 }} />
                    </Source>
                )}
            </MapGL>
        </div>
    );
};
