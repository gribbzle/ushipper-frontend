import { useMemo } from 'react';

import { useHandleFiltersChange, useQueryFilters } from '@/hooks';

import { WalletsFiltersFormState } from './wallets-filters.types';

export const useWalletsFilters = () => {
    const {
        filters: { balanceAmountType, type, search },
    } = useQueryFilters<WalletsFiltersFormState>();

    const handleFiltersChange = useHandleFiltersChange<WalletsFiltersFormState>({ resetPageOnChange: true });

    const initialValues = useMemo<WalletsFiltersFormState>(() => ({ balanceAmountType, type, search }), [balanceAmountType, type, search]);

    return {
        initialValues,
        handleFiltersChange,
    };
};
