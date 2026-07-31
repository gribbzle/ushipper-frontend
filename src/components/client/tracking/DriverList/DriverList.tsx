import React from 'react';

import { DriverRow } from '@/components/client/tracking/driver-row/driver-row';
import { useUsersTracking } from '@hooks';
import { UserTrackingProvider } from '@providers';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './styles.scss';

const cn = classname('driver-list');
const t = translateByNamespace('client:tracking-page');

interface DriversListProps {
    className?: string;
}

export const DriverList = ({ className }: DriversListProps) => {
    const trackingInfo = useUsersTracking();

    return (
        <div className={cn(null, className)}>
            {trackingInfo && trackingInfo.length > 0 ? (
                trackingInfo.map(userTracking => (
                    <UserTrackingProvider value={userTracking} key={userTracking.user.publicId}>
                        <DriverRow />
                    </UserTrackingProvider>
                ))
            ) : (
                <p className={cn('no-drivers')}>{t('no-drivers-found-by-search')}</p>
            )}
        </div>
    );
};
