import React from 'react';

import { useUsersTracking } from '@hooks';
import { UserTrackingProvider } from '@providers';

import { DriverMarker } from './DriverMarker';

export const DriverMarkers = (): JSX.Element => {
    const trackingInfo = useUsersTracking();

    return (
        <>
            {trackingInfo.map(
                (userTracking): JSX.Element => (
                    <UserTrackingProvider value={userTracking} key={userTracking.user.publicId}>
                        <DriverMarker />
                    </UserTrackingProvider>
                ),
            )}
        </>
    );
};
