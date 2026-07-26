import { useMemo } from 'react';

import { useHandleFiltersChange, useQueryFilters } from '@/hooks';

import { FuelTransactionsFiltersFormState } from './fuel-transactions-filters';

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
