import { useMemo } from 'react';

import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:loadboard-filters');

export const useLoadboardFiltersOptions = () => {
    const readyToShipOptions = useMemo(
        () =>
            [0, 1, 2, 3, 4, 5, 6, 7, 10, 14, 30, 60].map(item => ({
                value: item,
                label: t('days', { count: item }),
            })),
        [],
    );

    const newPostedAfterOptions = useMemo(
        () =>
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => ({
                value: item,
                label: t('hours', { count: item }),
            })),
        [],
    );

    const vehiclesAmountOptions = useMemo(() => {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => ({
            value: item,
            label: item,
        }));
    }, []);

    const maxVehiclesAmountOptions = useMemo(() => {
        return [...vehiclesAmountOptions];
    }, [vehiclesAmountOptions]);

    const conditionOptions = useMemo(() => {
        return [
            { label: t('operable'), value: 0 },
            { label: t('inoperable'), value: 1 },
        ];
    }, []);

    return { conditionOptions, maxVehiclesAmountOptions, vehiclesAmountOptions, newPostedAfterOptions, readyToShipOptions };
};
