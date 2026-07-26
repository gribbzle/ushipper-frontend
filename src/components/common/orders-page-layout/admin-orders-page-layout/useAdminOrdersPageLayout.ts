import { useCallback, useEffect, useMemo, useState } from 'react';
import cleanDeep from 'clean-deep';

import { OrderSortingDirection, OrderSortingName, OrderStatisticsStatus, OrderType } from '@enums';
import { useAppSelector } from '@store';
import { GetOrdersData, useGetOrdersQuery } from '@store/api/orders-api';
import { authorizedUserSelector } from '@store/global';
import { AdminFormOrdersFilters, OrdersAminFiltersFromUrlParams } from '@types';

import { useApplyAminOrdersFilters, useHandleOrdersLoadError, useIsOrdersPage, useReplacePathOrdersFilters, useScrollToOrdersPage } from '../hooks';

import { DEFAULT_PARAMS } from './constants';

export const useAdminOrdersPageLayout = (ordersType?: OrderType) => {
    const user = useAppSelector(authorizedUserSelector);

    const { applyFilters, allFilters } = useApplyAminOrdersFilters();

    const [page, setPage] = useState(allFilters.page ?? 1);

    useReplacePathOrdersFilters(allFilters);
    useScrollToOrdersPage('.orders-table', page);

    const statusFilter = useMemo((): OrderStatisticsStatus[] | undefined => allFilters.statisticsStatus, [allFilters.statisticsStatus]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage);
            const query: OrdersAminFiltersFromUrlParams = {
                ...allFilters,
                page: newPage,
            };

            applyFilters(query);
        },
        [allFilters, applyFilters],
    );

    const handlePerPageChange = useCallback(
        (perPage: number) => {
            const query: OrdersAminFiltersFromUrlParams = {
                ...allFilters,
                page: 1,
                perPage,
            };

            applyFilters(query);
        },
        [applyFilters, allFilters],
    );

    const handleFiltersChange = useCallback(
        (filters: AdminFormOrdersFilters) => {
            const { perPage } = allFilters;
            const query: OrdersAminFiltersFromUrlParams = cleanDeep({
                ...filters,
                perPage,
                page: 1,
            });

            applyFilters(query);
        },
        [allFilters, applyFilters],
    );

    const orderFilterParams = useMemo((): GetOrdersData => ({ ...DEFAULT_PARAMS, type: ordersType, page, ...allFilters }), [ordersType, allFilters, page]);

    const handleOrderChange = useCallback(
        (orderName: string, orderDirection: string) => {
            const query: OrdersAminFiltersFromUrlParams = {
                ...allFilters,
                orderName: orderName as OrderSortingName,
                orderDirection: orderDirection as OrderSortingDirection,
            };

            applyFilters(query);
        },
        [applyFilters, allFilters],
    );

    const { data: ordersPaginatedData, isError, isFetching, refetch } = useGetOrdersQuery(orderFilterParams);

    useHandleOrdersLoadError(isError);

    const isOrdersPage = useIsOrdersPage();

    useEffect(() => {
        if (!isOrdersPage) {
            return;
        }

        refetch();
    }, [refetch, user, isOrdersPage]);

    const ordersTableData = useMemo(() => {
        if (!ordersPaginatedData) {
            return null;
        }

        return {
            orders: ordersPaginatedData.data,
            lastPage: ordersPaginatedData.meta.lastPage,
            from: ordersPaginatedData.meta.from,
            to: ordersPaginatedData.meta.to,
            total: ordersPaginatedData.meta.total,
        };
    }, [ordersPaginatedData]);

    const showOrdersList = useMemo<boolean>(() => !!ordersTableData && !!ordersTableData.orders.length, [ordersTableData]);
    const showEmptyTabPanel = useMemo<boolean>(() => !!ordersTableData && ordersTableData.orders.length === 0 && !isFetching, [ordersTableData, isFetching]);

    // FIXME: если при использовании фильтра не вернулись записи показывается empty panel
    const showEmptyOrdersPanel = false;

    return {
        allFilters,
        orderFilterParams,
        statusFilter,
        showEmptyOrdersPanel,
        showEmptyTabPanel,
        showOrdersList,
        ordersTableData,
        handlePageChange,
        handlePerPageChange,
        handleFiltersChange,
        handleOrderChange,
    };
};
