import { useMemo } from 'react';

import { useHandleFiltersChange, useQueryFilters } from '@/hooks';

import { AlertsFiltersFormState } from './alerts-filters.types';

export const useAlertsFilters = () => {
    const {
        filters: { statuses, types, orderId },
    } = useQueryFilters<AlertsFiltersFormState>();

    const handleFiltersChange = useHandleFiltersChange<AlertsFiltersFormState>({ resetPageOnChange: true });

    const initialValues = useMemo<AlertsFiltersFormState>(() => ({ statuses, types, orderId }), [statuses, types, orderId]);

    return {
        initialValues,
        handleFiltersChange,
    };
};
