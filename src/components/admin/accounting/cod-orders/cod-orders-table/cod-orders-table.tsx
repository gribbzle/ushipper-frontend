import React from 'react';

import { OrdersTable } from '@/components/admin/orders/orders-table';
import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { TableLoader } from '@/components/common/table/common/table-loader/table-loader';
import { OrderType } from '@/enums/order/order-type';
import { translateByNamespace } from '@utils/i18n';

import { useCODOrdersTable } from './use-cod-orders-table';

const t = translateByNamespace('admin:accounting:cod-orders');

export const CODOrdersTable = () => {
    const { ordersData, isSuccess, isLoading, filters, onOrderChangeHandler, onPageChangeHandler, onPerPageChangeHandler } = useCODOrdersTable();

    if (isLoading) {
        return <TableLoader />;
    }

    if (!isSuccess) {
        return null;
    }

    if (ordersData?.data.length) {
        return (
            <OrdersTable
                data={ordersData.data}
                ordersType={OrderType.CARRIER}
                filters={filters}
                onOrderChange={onOrderChangeHandler}
                context='cod-cop'
                headerTableSticky={true}
                tablePaginationProps={{
                    page: filters.page,
                    perPage: filters.perPage,
                    lastPage: ordersData.meta.lastPage,
                    from: ordersData.meta.from,
                    to: ordersData.meta.to,
                    total: ordersData.meta.total,
                    onPageChange: onPageChangeHandler,
                    onChangePerPage: onPerPageChangeHandler,
                }}
            />
        );
    }

    return <EmptyLayout title={t('no-data-title')} />;
};
