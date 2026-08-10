import { useMemo } from 'react';

import { useHandleFiltersChange } from '@/hooks/filters/use-handle-filters-change';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';

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
