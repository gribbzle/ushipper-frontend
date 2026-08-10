import React, { useCallback, useMemo } from 'react';
import { useMap } from 'react-map-gl/mapbox';

import { DriverList } from '@/components/client/tracking/DriverList/DriverList';
import { MapBox } from '@/components/common/MapBox/MapBox';
import { useDriverTrackingMap } from '@hooks';
import { UsersTrackingProvider } from '@/providers/UsersTrackingProvider';
import { UserTrackingProvider } from '@/providers/UserTrackingProvider';
import { useAppSelector } from '@store';
import { useGetTrackingQuery } from '@store/api/users-api';
import { fetchedIsDriversListShownSelector, UserTracking } from '@store/client';
import { classname } from '@utils/classname';

import { OptimizedDirections, OrderDirection, OrderDirections } from './Directions';
import { DriverMarker, DriverMarkers } from './DriverMakers';
import DriverMapModeToggle from './DriverMapModeToggle';
import DriverSearchInput from './DriverSearchInput';

import './styles.scss';

const cn = classname('map-drivers-list');

export const DriversTrackingMap = (): JSX.Element => {
    const isDriversListShown = useAppSelector(fetchedIsDriversListShownSelector);
    const { trackingMap } = useMap();

    const {
        config: { driver, query, hasOrders, displayDriverLocation, displayOrderRoute, displayOrdersRoute, locationRectangle, displayOptimizedRoute },
        setConfig,
    } = useDriverTrackingMap();

    const { data: tracking } = useGetTrackingQuery(
        {
            query,
            hasOrders,
            locationRectangle,
            perPage: 100,
        },
        {
            skip: displayDriverLocation,
        },
    );

    const selectedUserTracking = useMemo((): UserTracking | undefined => {
        if (!driver?.publicId) {
            return;
        }

        return tracking?.find(({ user }): boolean => user.publicId == driver.publicId);
    }, [driver?.publicId, tracking]);

    const handleMoveEnd = useCallback((): void => {
        const bounds = trackingMap?.getBounds();

        if (!bounds) {
            return;
        }

        const boundsArray: [number, number, number, number] = [
            bounds.getNorthWest().lat,
            bounds.getNorthWest().lng,
            bounds.getSouthEast().lat,
            bounds.getSouthEast().lng,
        ];

        if (displayDriverLocation) {
            return;
        }

        setConfig({ locationRectangle: boundsArray });
    }, [displayDriverLocation, setConfig, trackingMap]);

    const handleClick = useCallback((): void => setConfig({}), [setConfig]);

    return (
        <MapBox id='trackingMap' enableStyleSwitcher={true} onClick={handleClick} onMoveEnd={handleMoveEnd}>
            {tracking && (
                <UsersTrackingProvider value={tracking}>
                    <DriverList className={cn('', { collapsed: !isDriversListShown })} />
                    <div className={cn('header')}>
                        <DriverSearchInput />
                        <DriverMapModeToggle />
                    </div>
                    {!displayDriverLocation && <DriverMarkers />}
                    {selectedUserTracking && (
                        <>
                            <UserTrackingProvider value={selectedUserTracking}>{displayDriverLocation && <DriverMarker />}</UserTrackingProvider>
                            {displayOrdersRoute && <OrderDirections />}
                            {displayOrderRoute && <OrderDirection />}
                            {displayOptimizedRoute && <OptimizedDirections />}
                        </>
                    )}
                </UsersTrackingProvider>
            )}
        </MapBox>
    );
};
