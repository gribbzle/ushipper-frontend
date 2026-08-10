import React, { useCallback } from 'react';
import { Marker } from 'react-map-gl/mapbox';

import { DriverOrderPin } from '@/components/client/tracking/common/driver-order-pin/driver-order-pin';
import { useDriverTrackingMap } from '@/hooks/tracking/useDriverTrackingMap';
import { useTracking } from '@/hooks/tracking/useTracking';
import { useUserTracking } from '@/hooks/tracking/useUserTracking';

export const DriverMarker = (): JSX.Element | null => {
    const { user: driver, orders } = useUserTracking();
    const { fitBoundsToOrdersRoute } = useTracking();

    const {
        setConfig,
        config: { driver: selectedDriver },
    } = useDriverTrackingMap();

    const handleClick = useCallback((): void => {
        fitBoundsToOrdersRoute(driver, orders);
        setConfig({ driver, orders, displayDriverLocation: true, displayOrdersRoute: true });
    }, [driver, fitBoundsToOrdersRoute, orders, setConfig]);

    const { latestLocation } = driver;

    if (!latestLocation) {
        return null;
    }

    const { geoLatitude, geoLongitude } = latestLocation;

    return (
        <Marker latitude={geoLatitude} longitude={geoLongitude} anchor='bottom'>
            <DriverOrderPin isActive={driver.publicId === selectedDriver?.publicId} driver={driver} onPress={handleClick} />
        </Marker>
    );
};
