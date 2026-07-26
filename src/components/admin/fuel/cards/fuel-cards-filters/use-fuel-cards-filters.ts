import { useMemo } from 'react';

import { useHandleFiltersChange, useQueryFilters } from '@/hooks';

import { FuelCardsFiltersFormState } from './fuel-cards-filters';

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
