import React, { useMemo } from 'react';

import { Button, MapBox, Popup } from '@/components';
import { DriverMarker } from '@/components/client/tracking/drivers-tracking-map/DriverMakers';
import { DriverTrackingMapProvider, UserTrackingProvider } from '@providers';
import { useAppSelector } from '@store';
import { driversMapPopupPropsSelector } from '@store/admin';
import { useGetTrackingQuery } from '@store/api/users-api';
import { UserTracking } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import { useDriversMapPopup } from './use-drivers-map-popup';

import './drivers-map-popup.scss';

const cn = classname('drivers-map-popup');
const t = translateByNamespace('admin:accounting:owners-and-drivers:drivers-map-popup');
const tActions = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const DriversMapPopup = () => {
    const { driverName, isPopupOpened, handleClosePopup } = useDriversMapPopup();
    const { driverAccountId } = useAppSelector(driversMapPopupPropsSelector);
    const { data: tracking } = useGetTrackingQuery({ accountId: driverAccountId ?? '' }, { skip: !driverAccountId });

    const userTracking = useMemo((): UserTracking | undefined => tracking?.[0], [tracking]);

    return (
        <Popup
            className={cn()}
            isOpen={isPopupOpened}
            onClose={handleClosePopup}
            title={t('latest-location-driver', { name: driverName ?? '' })}
            description={
                <div className={cn('map')}>
                    {!!userTracking && (
                        <DriverTrackingMapProvider>
                            <MapBox
                                initialViewState={{
                                    latitude: userTracking.user.latestLocation?.geoLatitude,
                                    longitude: userTracking.user.latestLocation?.geoLongitude,
                                    zoom: 4,
                                }}
                            >
                                <UserTrackingProvider value={userTracking}>
                                    <DriverMarker />
                                </UserTrackingProvider>
                            </MapBox>
                        </DriverTrackingMapProvider>
                    )}
                </div>
            }
            actions={
                <Button view='default' size='small' onClick={handleClosePopup}>
                    {tActions('cancel')}
                </Button>
            }
        />
    );
};
