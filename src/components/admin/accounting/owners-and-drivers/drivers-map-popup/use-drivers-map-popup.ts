import { useCallback, useEffect, useMemo } from 'react';

import { getTrackingDisplayedPathsOnMap } from '@/components/client/tracking/drivers-tracking-map/hooks';
import { useTrackingOrderColors } from '@/components/client/tracking/drivers-tracking-map/hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, driversMapPopupPropsSelector } from '@store/admin';
import { useGetTrackingQuery } from '@store/api/users-api';
import { trackingActions, TrackingMapPoint } from '@store/client';

export const useDriversMapPopup = () => {
    const { isPopupOpened, driverName, driverAccountId, users } = useAppSelector(driversMapPopupPropsSelector);
    const dispatch = useAppDispatch();

    const handleClosePopup = useCallback(() => {
        dispatch(accountingActions.setDriversMapPopupProps({ isPopupOpened: false, driverName: null, driverAccountId: null, users: null }));
    }, [dispatch]);

    const { data: tracking } = useGetTrackingQuery({ accountId: driverAccountId ?? '' }, { skip: !driverAccountId });

    const orderColors = useTrackingOrderColors(tracking);

    const displayedPathsOnMap = useMemo((): TrackingMapPoint[] => {
        if (!users) return [];

        return users.flatMap(user => getTrackingDisplayedPathsOnMap(tracking, user.publicId, null));
    }, [tracking, users]);

    const filteredData = useMemo(() => {
        if (!tracking || !users?.length) return [];

        const matchingItems = tracking.filter(item => users.some(user => user.publicId === item.user.publicId));

        if (!matchingItems.length) return [];

        const freshestItem = matchingItems.reduce((prev, current) => {
            const prevDate = new Date(prev.user.latestLocation?.createdAt || 0);
            const currentDate = new Date(current.user.latestLocation?.createdAt || 0);

            return currentDate > prevDate ? current : prev;
        });

        return [freshestItem];
    }, [tracking, users]);

    useEffect(() => {
        dispatch(trackingActions.setTestRoutePathLogic(true));
    }, [dispatch]);

    return { driverName, filteredData, isPopupOpened, orderColors, displayedPathsOnMap, handleClosePopup };
};
