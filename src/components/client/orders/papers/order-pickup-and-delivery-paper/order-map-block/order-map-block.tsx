import React, { useMemo, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import type { MapRef } from 'react-map-gl/mapbox';
import { Map, Marker } from 'react-map-gl/mapbox';

import { DriverOrderPin } from '@/components/client/tracking/common/driver-order-pin/driver-order-pin';
import { MapOrderRoute } from '@/components/client/tracking/common/map-order-route/map-order-route';
import { OrderMarker } from '@/components/client/tracking/common/order-marker/order-marker';
import { ColorValueHex } from '@/shared/types';
import { useAppSelector } from '@store';
import { orderDriverSelector, orderSelector } from '@store/client';
import { classname } from '@utils/classname';
import { getOrderTrackingPoints } from '@utils/tracking/get-order-tracking-points';

import './order-map-block.scss';

const cn = classname('order-map-block');

const COLOR_OF_ORDER: ColorValueHex = '#6284FF';
const defaultColor = '#409eff';

export const OrderMapBlock = () => {
    const order = useAppSelector(orderSelector);
    const driver = useAppSelector(orderDriverSelector);

    const mapRef = useRef<MapRef>(null);
    const bounds = useMemo(() => new mapboxgl.LngLatBounds([-124.736342, 24.521208], [-66.945392, 49.382808]), []);

    const { startPoint, endPoint } = useMemo(() => {
        if (!order || !order.pickupInformation?.geoLatitude || !order.pickupInformation?.geoLongitude) {
            return {};
        }

        const { startPoint, endPoint } = getOrderTrackingPoints(order);

        return { startPoint: startPoint ?? null, endPoint: endPoint ?? null };
    }, [order]);

    const orderColors = useMemo(
        () =>
            order
                ? [
                      {
                          orderId: order.publicId,
                          orderColor: COLOR_OF_ORDER,
                      },
                  ]
                : [],
        [order],
    );

    const driverMarker = useMemo(() => {
        const driverLatitude = driver?.latestLocation?.geoLatitude;
        const driverLongitude = driver?.latestLocation?.geoLongitude;

        if (!driverLatitude || !driverLongitude) {
            return null;
        }

        return (
            <Marker style={{ zIndex: 0 }} key={driver.publicId} latitude={driverLatitude} longitude={driverLongitude} anchor='bottom'>
                <DriverOrderPin driver={driver} isDisabled={true} />
            </Marker>
        );
    }, [driver]);

    const orderColor = useMemo(() => orderColors.find(item => item.orderId === order?.publicId)?.orderColor || defaultColor, [orderColors, order]);

    return (
        <div className={cn('')}>
            <Map
                ref={mapRef}
                mapboxAccessToken={process.env.mapboxToken}
                onRender={event => event.target.resize()}
                mapStyle='mapbox://styles/mapbox/streets-v9'
            >
                {startPoint && (
                    <Marker latitude={startPoint.lat} longitude={startPoint.lon}>
                        <OrderMarker borderColor={orderColor} type={startPoint.markerType} />
                    </Marker>
                )}
                {endPoint && (
                    <Marker latitude={endPoint.lat} longitude={endPoint.lon}>
                        <OrderMarker borderColor={orderColor} type={endPoint.markerType} />
                    </Marker>
                )}
                {startPoint && endPoint && (
                    <MapOrderRoute
                        bounds={bounds}
                        key={`${startPoint.orderId}${endPoint.orderId}`}
                        startPoint={startPoint}
                        endPoint={endPoint}
                        mapRef={mapRef}
                    />
                )}
                {driverMarker}
            </Map>
        </div>
    );
};
