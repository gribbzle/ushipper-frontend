import React, { useEffect } from 'react';

import { DriversTrackingMap } from '@/components/client/tracking/drivers-tracking-map/drivers-tracking-map';
import { DriverTrackingMapProvider } from '@/providers/DriverTrackingMapProvider';
import { useAppSelector } from '@store';
import { fetchedSelectedDriverIdSelector } from '@store/client';

import './carrier-tracking-page.scss';

export const CarrierTrackingPage = () => {
    const selectedDriverId = useAppSelector(fetchedSelectedDriverIdSelector);

    useEffect((): void => {
        const selectedDriverPanel = document.getElementById(`${selectedDriverId}`);

        selectedDriverPanel?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedDriverId]);

    return (
        <DriverTrackingMapProvider>
            <DriversTrackingMap />
        </DriverTrackingMapProvider>
    );
};
