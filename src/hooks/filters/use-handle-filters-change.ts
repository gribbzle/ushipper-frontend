import { useCallback } from 'react';
import { FormApi } from 'final-form';

import { AppFilters, useQueryFilters } from './use-query-filters';

type UseHandleFiltersChangeOptions = {
    resetPageOnChange?: boolean;
};

export const useHandleFiltersChange = <T extends Record<string, unknown>>({ resetPageOnChange }: UseHandleFiltersChangeOptions = {}) => {
    const { setFilters } = useQueryFilters<T>();

    const handleFiltersChange = useCallback(
        (values: AppFilters | T, touched: boolean | FormApi<T>) => {
            if (!touched) {
                return;
            }

            setFilters({ ...values, ...(resetPageOnChange ? { page: 1 } : {}) });
        },
        [resetPageOnChange, setFilters],
    );

    return handleFiltersChange;
};
