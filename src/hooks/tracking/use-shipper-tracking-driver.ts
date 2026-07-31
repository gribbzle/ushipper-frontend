import { useMemo } from 'react';

import { useAppSelector } from '@store';
import { useGetTrackingDriverQuery } from '@store/api/tracking-api';
import { fetchedSelectedDriverIdSelector } from '@store/client';
import { getTrackingDriverAverageSpeed } from '@utils/tracking/tracking-driver-helpers';

export const useShipperTrackingDriver = () => {
    const driverPublicId = useAppSelector(fetchedSelectedDriverIdSelector);

    const { data: fetchedDriver, isError, isFetching } = useGetTrackingDriverQuery(driverPublicId as string, { skip: !driverPublicId });

    const driver = driverPublicId ? fetchedDriver : null;

    const averageSpeed = useMemo(() => (driver ? getTrackingDriverAverageSpeed(driver) : null), [driver]);

    return {
        driver,
        driverPublicId,
        latestLocation: driver?.latestLocation ?? null,
        averageSpeed,
        isError,
        isFetching,
    };
};
