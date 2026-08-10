import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { getObjectWithoutEmptyFields } from '@utils/objects';

export type AppFilters = {
    page: number;
    perPage?: number;
    orderName?: string;
    orderDirection?: string;
};

type InitialFilters = Pick<AppFilters, 'orderDirection' | 'orderName' | 'perPage'>;

export const useQueryFilters = <T>(initialFilters?: InitialFilters) => {
    const router = useRouter();
    const {
        query: { page, perPage, orderName, orderDirection, ...otherFilters },
    } = router;

    const filters = useMemo<AppFilters & T>(
        () =>
            ({
                page: Number(page) || 1,
                perPage: Number(perPage) || initialFilters?.perPage || 20,
                orderName: orderName ? String(orderName) : initialFilters?.orderName ?? undefined,
                orderDirection: orderDirection ? String(orderDirection) : initialFilters?.orderDirection ?? OrderSortingDirection.ASC,
                ...otherFilters,
            } as AppFilters & T),
        [orderDirection, orderName, initialFilters, otherFilters, page, perPage],
    );

    const setFilters = useCallback(
        (filters: Partial<AppFilters | T>) => {
            const query = getObjectWithoutEmptyFields({ ...router.query, ...filters });

            router.replace(
                { pathname: router.pathname, query },
                {
                    pathname: router.asPath.split('?')[0],
                    query,
                },
            );
        },
        [router],
    );

    return {
        filters,
        setFilters,
    };
};
