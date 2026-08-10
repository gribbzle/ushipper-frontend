import { useMemo } from 'react';

import { useHandleFiltersChange } from '@/hooks/filters/use-handle-filters-change';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';

import { WalletFiltersState } from './wallet-filters.types';

export const useWalletFilters = () => {
    const {
        filters: { createdAtFrom, createdAtTo, fundsMovement },
    } = useQueryFilters<WalletFiltersState>();

    const handleFiltersChange = useHandleFiltersChange<WalletFiltersState>({ resetPageOnChange: true });

    const initialValues = useMemo<WalletFiltersState>(() => ({ createdAtFrom, createdAtTo, fundsMovement }), [createdAtFrom, createdAtTo, fundsMovement]);

    return {
        initialValues,
        handleFiltersChange,
    };
};
