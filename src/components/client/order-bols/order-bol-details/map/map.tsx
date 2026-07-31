import React, { useEffect, useMemo, useRef, useState } from 'react';
import has from 'has-values';
import mapboxgl from 'mapbox-gl';
import type { MapRef } from 'react-map-gl/mapbox';
import { Map as MapGL, Marker } from 'react-map-gl/mapbox';

import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { MapMarker } from './map-marker';

import 'mapbox-gl/dist/mapbox-gl.css';
import './map.scss';

const cn = classname('map');
const t = translateByNamespace('client:order-BOL-page');

type Props = {
    className?: string;
    pickupInformation: OrderPickupInformation;
    deliveryInformation: OrderDeliveryInformation;
};

export const Map = ({ className, deliveryInformation, pickupInformation }: Props) => {
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

        if (pickupBounds.latitude && pickupBounds.longitude) {
            bounds.extend([pickupBounds.longitude, pickupBounds.latitude]);
        }

        if (deliveryBounds.latitude && deliveryBounds.longitude) {
            bounds.extend([deliveryBounds.longitude, deliveryBounds.latitude]);
        }

        if (mapRef.current && has(bounds)) {
            mapRef.current.fitBounds(bounds, { padding: 40 });
        }
    }, [deliveryBounds?.latitude, deliveryBounds?.longitude, mapLoaded, pickupBounds?.latitude, pickupBounds?.longitude]);

    return (
        <div className={cn('', [className])}>
            <MapGL
                ref={mapRef}
                mapboxAccessToken={process.env.mapboxToken}
                onRender={event => event.target.resize()}
                mapStyle='mapbox://styles/mapbox/streets-v9'
                style={{ position: 'absolute', borderRadius: '8px' }}
                onLoad={() => setMapLoaded(true)}
            >
                {pickupBounds.latitude && pickupBounds.longitude && (
                    <Marker latitude={pickupBounds.latitude} longitude={pickupBounds.longitude}>
                        <MapMarker>{t('pickup')}</MapMarker>
                    </Marker>
                )}
                {deliveryBounds.latitude && deliveryBounds.longitude && (
                    <Marker latitude={deliveryBounds.latitude} longitude={deliveryBounds.longitude}>
                        <MapMarker>{t('delivery')}</MapMarker>
                    </Marker>
                )}
            </MapGL>
        </div>
    );
};
