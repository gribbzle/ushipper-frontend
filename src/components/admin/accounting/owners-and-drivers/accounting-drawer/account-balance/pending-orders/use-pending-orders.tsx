import React, { useCallback, useMemo } from 'react';

import { Loader } from '@/components/common/loader/loader';
import { DRIVER_ACCOUNT_PENDING_ORDERS_FILTERS } from '@constants';
import { OrderStatisticsStatus } from '@/enums/order/order-statistics-status';
import { OrderStatus } from '@/enums/order-status';
import { useAppSelector } from '@store';
import { accountingDrawerPropsSelector } from '@store/admin';
import { useGetOrdersQuery, useGetOrdersStatisticsCountersQuery } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { buildQueryString } from '@utils/urls';

const cn = classname('pending-orders');

export const usePendingOrders = () => {
    const { accountId } = useAppSelector(accountingDrawerPropsSelector);

    const { data: ordersPaginatedData } = useGetOrdersQuery(
        {
            ...DRIVER_ACCOUNT_PENDING_ORDERS_FILTERS,
            perPage: 3,
            statuses: [OrderStatus.DELIVERED],
            driverAccountId: [accountId ?? ''],
        },
        { skip: !accountId },
    );

    const { data: statisticsCounters, isLoading } = useGetOrdersStatisticsCountersQuery(
        {
            ownerAccountId: accountId ?? '',
        },
        { skip: !accountId },
    );

    const areMoreOrders = useMemo((): boolean => !!ordersPaginatedData?.meta?.lastPage && ordersPaginatedData.meta.lastPage > 1, [ordersPaginatedData]);

    const onViewMoreOrdersClick = useCallback(async () => {
        if (accountId) {
            const queryParams = {
                ...DRIVER_ACCOUNT_PENDING_ORDERS_FILTERS,
                statisticsStatus: OrderStatisticsStatus.DELIVERED,
                driverAccountId: accountId,
            };

            const queryString = buildQueryString(queryParams);

            const url = `/admin/orders/carrier?${queryString}`;

            window.open(url, '_blank');
        }
    }, [accountId]);

    const subTitle = useMemo(() => {
        if (isLoading) {
            return <Loader className={cn('loader')} />;
        }

        return statisticsCounters?.statusCounters?.deliveredPendingSum?.formatted;
    }, [statisticsCounters?.statusCounters?.deliveredPendingSum, isLoading]);

    return { areMoreOrders, ordersPaginatedData, subTitle, onViewMoreOrdersClick };
};
