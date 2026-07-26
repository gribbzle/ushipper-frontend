import React, { useEffect, useMemo, useState } from 'react';
import { GeoJSON } from 'geojson';
import { Marker } from 'react-map-gl/mapbox';

import { OrderMarker } from '@components';
import { useOrderTracking, useTracking } from '@hooks';
import { Coordinate } from '@types';

import Source from './Source';

const Direction = (): JSX.Element => {
    const [direction, setDirection] = useState<GeoJSON>();
    const { getDirection } = useTracking();

    const {
        color,
        pickupInformation: { geoLatitude: pickupLatitude, geoLongitude: pickupLongitude },
        deliveryInformation: { geoLongitude: deliveryLongitude, geoLatitude: deliveryLatitude },
    } = useOrderTracking();

    const pickup = useMemo((): Coordinate | undefined => {
        if (!pickupLongitude || !pickupLatitude) {
            return;
        }

        return {
            latitude: pickupLatitude,
            longitude: pickupLongitude,
        };
    }, [pickupLatitude, pickupLongitude]);

    const delivery = useMemo((): Coordinate | undefined => {
        if (!deliveryLongitude || !deliveryLatitude) {
            return;
        }

        return {
            longitude: deliveryLongitude,
            latitude: deliveryLatitude,
        };
    }, [deliveryLatitude, deliveryLongitude]);

    useEffect((): void => {
        (async (): Promise<void> => {
            if (pickup && delivery) {
                const direction = await getDirection([pickup, delivery]);

                setDirection(direction);
            }
        })();
    }, [delivery, getDirection, pickup]);

    return (
        <>
            {!!pickup && (
                <Marker longitude={pickup.longitude} latitude={pickup.latitude}>
                    <OrderMarker type='pickup' borderColor={color} />
                </Marker>
            )}
            {direction && <Source color={color} data={direction} />}
            {delivery && (
                <Marker longitude={delivery.longitude} latitude={delivery.latitude}>
                    <OrderMarker type='delivery' borderColor={color} />
                </Marker>
            )}
        </>
    );
};

export default Direction;
