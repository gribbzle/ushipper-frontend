import { useMemo } from 'react';

import { useHandleFiltersChange } from '@/hooks/filters/use-handle-filters-change';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';

import { FuelTransactionsFiltersFormState } from './fuel-transactions-filters.types';

export const useFuelTransactionsFilters = () => {
    const {
        filters: { statuses, cardId, accountId, companyName },
    } = useQueryFilters<FuelTransactionsFiltersFormState>();

    const handleFiltersChange = useHandleFiltersChange<FuelTransactionsFiltersFormState>({ resetPageOnChange: true });

    const initialValues = useMemo<FuelTransactionsFiltersFormState>(
        () => ({
            statuses,
            cardId,
            accountId,
            companyName,
        }),
        [statuses, cardId, accountId, companyName],
    );

    return {
        initialValues,
        handleFiltersChange,
    };
};
