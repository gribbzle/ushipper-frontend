import { useMemo } from 'react';

import { useHandleFiltersChange, useQueryFilters } from '@/hooks';

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
