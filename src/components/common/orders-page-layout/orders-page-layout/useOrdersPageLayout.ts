import { useCallback, useEffect, useMemo, useState } from 'react';
import cleanDeep from 'clean-deep';

import { OrderSortingDirection, OrderSortingName, OrderStatisticsGroup, OrderStatisticsStatus } from '@enums';
import { useHasPartnerCompanies, useIsPartnerCompany, useMeCarrier, useMeDriverRelated } from '@hooks';
import { useAppSelector } from '@store';
import { GetOrdersData, useGetOrdersQuery, useGetOrdersStatisticsCountersQuery } from '@store/api/orders-api';
import { authorizedAccountParentIdSelector, authorizedAccountPublicIdSelector, authorizedUserSelector } from '@store/global';
import { FormOrdersFilters, OrdersFiltersFromUrlParams } from '@types';

import { useApplyOrdersFilters, useHandleOrdersLoadError, useIsOrdersPage, useReplacePathOrdersFilters, useScrollToOrdersPage } from '../hooks';
import { getPartnerStatisticStatus } from '../utils';

export const useOrdersPageLayout = (requestsPageContext?: boolean) => {
    const user = useAppSelector(authorizedUserSelector);
    const authorizedAccountParentId = useAppSelector(authorizedAccountParentIdSelector);
    const authorizedAccountPublicId = useAppSelector(authorizedAccountPublicIdSelector);

    const isPartner = useIsPartnerCompany();
    const { hasPartnerCompanies } = useHasPartnerCompanies();
    const isMeCarrier = useMeCarrier();
    const isDriver = useMeDriverRelated();

    const { applyFilters, allFilters } = useApplyOrdersFilters();

    const [page, setPage] = useState(allFilters.page ?? 1);

    useReplacePathOrdersFilters(allFilters);
    useScrollToOrdersPage('.orders-page', page);

    const groupFilter = useMemo((): OrderStatisticsGroup | undefined => allFilters.statisticsGroup, [allFilters.statisticsGroup]);
    const statusFilter = useMemo((): OrderStatisticsStatus | undefined => allFilters.statisticsStatus, [allFilters.statisticsStatus]);

    useEffect(() => {
        if (!requestsPageContext && !allFilters.statisticsStatus) {
            applyFilters({
                ...allFilters,
                statisticsStatus: OrderStatisticsStatus.NEW,
            });
        }
    }, [allFilters, requestsPageContext, applyFilters]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage);
            const query: OrdersFiltersFromUrlParams = {
                ...allFilters,
                page: newPage,
            };

            applyFilters(query);
        },
        [allFilters, applyFilters],
    );
    const handleFiltersChange = useCallback(
        (filters: FormOrdersFilters) => {
            const { statisticsGroup, statisticsStatus, perPage } = allFilters;
            const query: OrdersFiltersFromUrlParams = cleanDeep({ statisticsGroup, statisticsStatus, perPage, ...filters, page: 1 });

            applyFilters(query);
        },
        [allFilters, applyFilters],
    );

    const handleTabFilterClick = useCallback(
        (value: OrderStatisticsStatus) => {
            const query: OrdersFiltersFromUrlParams = {
                ...allFilters,
                statisticsStatus: value,
                page: 1,
            };

            applyFilters(query);
        },
        [applyFilters, allFilters],
    );

    const handleCounterClick = useCallback(
        (value?: OrderStatisticsGroup) => {
            const newQuery: OrdersFiltersFromUrlParams = {
                ...allFilters,
                statisticsGroup: value,
                page: 1,
            };

            applyFilters(newQuery);
        },
        [applyFilters, allFilters],
    );

    const customBackToOrders = useCallback(() => handleCounterClick(undefined), [handleCounterClick]);

    const orderFilterParams = useMemo((): GetOrdersData => {
        const defaultGetOrdersData: GetOrdersData = {
            page: 1,
            perPage: 20,
            orderName: OrderSortingName.PICKUP_LOCATION,
            orderDirection: OrderSortingDirection.ASC,
        };

        const statisticsStatus = allFilters.statisticsGroup ? undefined : allFilters.statisticsStatus;
        let params: GetOrdersData = { ...defaultGetOrdersData, page, ...allFilters, statisticsStatus };

        if (requestsPageContext) {
            params.hasOrderRequests = requestsPageContext ? 1 : 0;
        }

        if ((isPartner && isMeCarrier) || (hasPartnerCompanies && isDriver)) {
            const partnerStatisticStatus = getPartnerStatisticStatus(statisticsStatus);

            if (partnerStatisticStatus) {
                params = { ...params, ...partnerStatisticStatus };
            }
        }

        if (isDriver && !authorizedAccountParentId && authorizedAccountPublicId) {
            params.ownerAccountId = authorizedAccountPublicId;
        }

        return params;
    }, [allFilters, page, requestsPageContext, isMeCarrier, isPartner, hasPartnerCompanies, isDriver, authorizedAccountParentId, authorizedAccountPublicId]);

    const { data: ordersPaginatedData, isError: ordersError, isFetching, refetch } = useGetOrdersQuery(orderFilterParams);

    const statisticsCountersParams = useMemo(() => {
        const { search, searchSubject, dispatchers, driverAccountId, ownerAccountId } = orderFilterParams;

        return {
            search,
            searchSubject,
            dispatchers,
            driverAccountId,
            ...(ownerAccountId ? { ownerAccountId } : {}),
        };
    }, [orderFilterParams]);

    const { data: statisticsCounters, refetch: refetchCounters } = useGetOrdersStatisticsCountersQuery(statisticsCountersParams);

    useHandleOrdersLoadError(ordersError);

    const isOrdersPage = useIsOrdersPage();

    useEffect(() => {
        if (!isOrdersPage) {
            return;
        }

        refetch();
        refetchCounters();
    }, [refetch, refetchCounters, user, isOrdersPage]);

    const showOrdersList = useMemo(() => !!ordersPaginatedData && ordersPaginatedData.data.length > 0, [ordersPaginatedData]);

    const showEmptyTabPanel = useMemo(
        () => !requestsPageContext && !!ordersPaginatedData && ordersPaginatedData.data.length === 0 && !isFetching,
        [ordersPaginatedData, isFetching, requestsPageContext],
    );

    // FIXME: если при использовании фильтра не вернулись записи показывается empty panel
    const showEmptyOrdersPanel = false;

    return {
        showOrdersList,
        showEmptyTabPanel,
        showEmptyOrdersPanel,
        groupFilter,
        statusFilter,
        allFilters,
        statisticsCounters,
        ordersPaginatedData,
        customBackToOrders,
        handleCounterClick,
        handleTabFilterClick,
        handleFiltersChange,
        handlePageChange,
    };
};
