import { useMemo } from 'react';

import { useHandleFiltersChange } from '@/hooks/filters/use-handle-filters-change';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';

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
