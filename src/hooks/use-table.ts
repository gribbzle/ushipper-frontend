import { useCallback } from 'react';
import { toSnakeCase } from 'js-convert-case';

import { useQueryFilters } from './filters/use-query-filters';
import { usePagination } from './use-pagination';

export const useTable = () => {
    const { setFilters } = useQueryFilters();
    const { onPageChangeHandler } = usePagination();

    const onOrderChangeHandler = useCallback(
        (orderName: string, orderDirection: string) => {
            setFilters({ orderName: toSnakeCase(orderName), orderDirection });
        },
        [setFilters],
    );

    const onPerPageChangeHandler = useCallback(
        (perPage: number) => {
            setFilters({ perPage, page: 1 });
        },
        [setFilters],
    );

    return {
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
    };
};
