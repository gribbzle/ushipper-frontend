import React from 'react';
import { useMap } from 'react-map-gl/mapbox';

import { NativeSwitch } from '@/fields/switch-input/native-switch';
import { useAppDispatch, useAppSelector } from '@store';
import { fetchedIsDriversListShownSelector, trackingActions } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './carrier-tracking-page-head.scss';

const t = translateByNamespace('client:tracking-page');
const cn = classname('carrier-tracking-page-head');

export const CarrierTrackingPageHead = () => {
    const dispatch = useAppDispatch();
    const isDriversListShown = useAppSelector(fetchedIsDriversListShownSelector);
    const { trackingMap } = useMap();

    const handleToggleIsDriversListShown = (value: boolean) => {
        dispatch(trackingActions.setIsDriversListShown(value));

        trackingMap?.easeTo({
            padding: {
                left: value ? 380 : 40,
            },
        });
    };

    return (
        <div className={cn('')}>
            {t('header-title')}
            <NativeSwitch label={t('drivers-list')} checked={isDriversListShown} onChange={handleToggleIsDriversListShown} />
        </div>
    );
};
