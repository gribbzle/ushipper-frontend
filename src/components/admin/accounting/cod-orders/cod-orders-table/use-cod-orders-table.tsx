import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { DEFAULT_COD_COP_ORDERS_PARAMS } from '@constants';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { useTable } from '@/hooks/use-table';
import { GetOrdersData, useGetOrdersQuery } from '@store/api/orders-api';
import { convertToStringArray } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:orders-page:notifications');

export const useCODOrdersTable = () => {
    const { onOrderChangeHandler, onPageChangeHandler, onPerPageChangeHandler } = useTable();
    const { filters } = useQueryFilters<GetOrdersData>(DEFAULT_COD_COP_ORDERS_PARAMS);
    const { dispatchers, ...otherFilters } = filters;

    const params = useMemo(
        (): GetOrdersData => ({
            ...DEFAULT_COD_COP_ORDERS_PARAMS,
            ...otherFilters,
            ...(dispatchers ? { dispatchers: convertToStringArray(dispatchers) } : {}),
        }),
        [dispatchers, otherFilters],
    );

    const { data: ordersData, isSuccess, isLoading, isError } = useGetOrdersQuery(params);

    useEffect(() => {
        if (isError) {
            toast.error<string>(t('load-orders-error'));
        }
    }, [isError]);

    return {
        isLoading,
        isSuccess,
        ordersData,
        filters: { ...DEFAULT_COD_COP_ORDERS_PARAMS, ...filters },
        onOrderChangeHandler,
        onPageChangeHandler,
        onPerPageChangeHandler,
    };
};
