import React, { useMemo } from 'react';
import { Marker } from 'react-map-gl/mapbox';

import { useAppSelector } from '@store';
import { useGetTrackingDriversQuery } from '@store/api/tracking-api';
import { selectedShipperTrackingOrderSelector, TrackingDriver } from '@store/client';

import { DriverTruckPin } from '../../driver-truck-pin';

type DriversMarkersProps = {
    orderId: string;
    onMarkerClick: (driver: TrackingDriver) => void;
};

const DEFAULT_RADIUS = 1000;

export const DriversMarkers = ({ orderId, onMarkerClick }: DriversMarkersProps) => {
    const { data: drivers } = useGetTrackingDriversQuery({ orderId, radius: DEFAULT_RADIUS });
    const selectedOrder = useAppSelector(selectedShipperTrackingOrderSelector);

    const driverMarkers = useMemo(
        () =>
            drivers?.map(driver => {
                const { latestLocation, publicId } = driver;
                const driverLatitude = latestLocation?.geoLatitude;
                const driverLongitude = latestLocation?.geoLongitude;

                return (
                    driverLatitude &&
                    driverLongitude && (
                        <Marker
                            style={{ zIndex: 2 }}
                            key={publicId}
                            latitude={driverLatitude}
                            longitude={driverLongitude}
                            anchor='bottom'
                            onClick={selectedOrder ? () => onMarkerClick(driver) : undefined}
                        >
                            <DriverTruckPin driver={driver} disabled={!selectedOrder} />
                        </Marker>
                    )
                );
            }),
        [drivers, selectedOrder, onMarkerClick],
    );

    return <>{driverMarkers}</>;
};
