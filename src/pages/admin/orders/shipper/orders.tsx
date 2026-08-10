import React from 'react';

import { AdminOrdersPageHead } from '@/components/admin/orders/orders-page-head/orders-page-head';
import { AdminOrdersPageLayout } from '@/components/common/orders-page-layout/admin-orders-page-layout/admin-orders-page-layout';
import { getMainLayout } from '@/components/common/main-layout/main-layout';
import { OrdersTableContainer } from '@/components/admin/orders/orders-table-container/orders-table-container';
import { RenderOrdersTableProps } from '@/components/common/orders-page-layout/admin-orders-page-layout/admin-orders-page-layout.types';
import { OrderType } from '@enums';

const ORDERS_TYPE = OrderType.SHIPPER;

const OrdersPage = () => (
    <AdminOrdersPageLayout
        renderOrdersTable={({ orders, filters, paginationProps, onOrderChange }: RenderOrdersTableProps) => (
            <OrdersTableContainer data={orders} ordersType={ORDERS_TYPE} filters={filters} paginationProps={paginationProps} onOrderChange={onOrderChange} />
        )}
        ordersType={ORDERS_TYPE}
    />
);

OrdersPage.getLayout = getMainLayout({
    head: <AdminOrdersPageHead ordersType={ORDERS_TYPE} />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.orders.view_any' }],
});

export default OrdersPage;
