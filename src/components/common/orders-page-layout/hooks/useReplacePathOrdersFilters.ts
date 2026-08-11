import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { OrdersAminFiltersFromUrlParams, OrdersFiltersFromUrlParams } from '@/types/order';

export const useReplacePathOrdersFilters = (filters: OrdersFiltersFromUrlParams | OrdersAminFiltersFromUrlParams) => {
    const router = useRouter();

    useEffect(() => {
        router.replace(
            {
                pathname: router.pathname,
                query: filters,
            },
            {
                pathname: router.pathname.replace(/^\/client/, ''),
                query: filters,
            },
            { shallow: true },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters]);
};
