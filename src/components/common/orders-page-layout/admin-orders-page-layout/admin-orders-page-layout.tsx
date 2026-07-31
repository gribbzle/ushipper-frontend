import React from 'react';

import { OrdersEmptyTabPanel } from '@/components/client/orders/orders-empty-tab-panel/orders-empty-tab-panel';
import { classname } from '@utils/classname';

import { AdminOrdersFilters } from '../admin-orders-filters';
import { EmptyOrdersPanel } from '../empty-orders-panel';

import { AdminOrdersPageLayoutProps } from './admin-orders-page-layout.types';
import { useAdminOrdersPageLayout } from './useAdminOrdersPageLayout';

import '../orders.scss';

const cn = classname('orders-page');

export const AdminOrdersPageLayout = ({ renderOrdersTable, ordersType }: AdminOrdersPageLayoutProps) => {
    const {
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
    } = useAdminOrdersPageLayout(ordersType);

    return (
        <div className={cn()}>
            {showEmptyOrdersPanel ? (
                <EmptyOrdersPanel showLink={false} />
            ) : (
                <div className={cn('body')}>
                    <AdminOrdersFilters initialFilters={allFilters} onFiltersChange={handleFiltersChange} />
                    {showOrdersList &&
                        ordersTableData &&
                        renderOrdersTable({
                            orders: ordersTableData.orders,
                            filters: orderFilterParams,
                            paginationProps: {
                                page: orderFilterParams.page ?? 1,
                                perPage: orderFilterParams.perPage,
                                lastPage: ordersTableData.lastPage,
                                from: ordersTableData.from,
                                to: ordersTableData.to,
                                total: ordersTableData.total,
                                onPageChange: handlePageChange,
                                onChangePerPage: handlePerPageChange,
                            },
                            onOrderChange: handleOrderChange,
                        })}
                    {showEmptyTabPanel && <OrdersEmptyTabPanel hideBtn={true} status={statusFilter} />}
                </div>
            )}
        </div>
    );
};
