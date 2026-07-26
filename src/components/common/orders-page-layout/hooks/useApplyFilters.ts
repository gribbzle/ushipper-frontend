import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';

import { OrdersAminFiltersFromUrlParams, OrdersFiltersFromUrlParams } from '@types';
import { getAllAminOrdersFiltersFromUrlParams, getAllOrdersFiltersFromUrlParams } from '@utils';

type FilterType = OrdersFiltersFromUrlParams | OrdersAminFiltersFromUrlParams;

const useApplyFilters = <T extends FilterType>(getFiltersFromUrl: (query: Record<string, any>) => T) => {
    const router = useRouter();

    const [allFilters, setFilters] = useState<T>(getFiltersFromUrl(router.query));

    const applyFilters = useCallback(async (query: T) => {
        setFilters(query);
    }, []);

    return { applyFilters, allFilters };
};

export const useApplyOrdersFilters = () => useApplyFilters<OrdersFiltersFromUrlParams>(getAllOrdersFiltersFromUrlParams);

export const useApplyAminOrdersFilters = () => useApplyFilters<OrdersAminFiltersFromUrlParams>(getAllAminOrdersFiltersFromUrlParams);
