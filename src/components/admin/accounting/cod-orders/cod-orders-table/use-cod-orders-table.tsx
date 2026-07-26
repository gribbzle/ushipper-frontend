import { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { DEFAULT_COD_COP_ORDERS_PARAMS } from '@constants';
import { useQueryFilters, useTable } from '@hooks';
import { GetOrdersData, useGetOrdersQuery } from '@store/api/orders-api';
import { convertToStringArray, translateByNamespace } from '@utils';

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
