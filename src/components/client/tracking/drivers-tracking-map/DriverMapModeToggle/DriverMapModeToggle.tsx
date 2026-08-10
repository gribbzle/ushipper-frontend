import React, { useCallback } from 'react';

import { useDriverTrackingMap } from '@hooks';
import { SegmentedControl } from '@/components/ui/panel/SegmentedControl';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:tracking-page');

const SEGMENTS = [
    { value: 1, label: t('with-orders') },
    { value: 0, label: t('without-orders') },
];

const DriverMapModeToggle = (): JSX.Element => {
    const { setConfig } = useDriverTrackingMap();

    const handleToggleShowDriversWithOrders = useCallback(
        (value: number | string): void => {
            if (typeof value !== 'number') {
                return;
            }

            setConfig({ hasOrders: value });
        },
        [setConfig],
    );

    return <SegmentedControl name='map' segments={SEGMENTS} callback={handleToggleShowDriversWithOrders} />;
};

export default DriverMapModeToggle;
