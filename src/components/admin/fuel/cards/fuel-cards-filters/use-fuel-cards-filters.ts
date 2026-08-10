import { useMemo } from 'react';

import { useHandleFiltersChange } from '@/hooks/filters/use-handle-filters-change';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';

import { FuelCardsFiltersFormState } from './fuel-cards-filters.types';

export const useFuelCardsFilters = () => {
    const {
        filters: { statuses, number, accountId, companyName },
    } = useQueryFilters<FuelCardsFiltersFormState>();

    const handleFiltersChange = useHandleFiltersChange<FuelCardsFiltersFormState>({ resetPageOnChange: true });

    const initialValues = useMemo<FuelCardsFiltersFormState>(
        () => ({
            statuses,
            number,
            accountId,
            companyName,
        }),
        [statuses, number, accountId, companyName],
    );

    return {
        initialValues,
        handleFiltersChange,
    };
};
