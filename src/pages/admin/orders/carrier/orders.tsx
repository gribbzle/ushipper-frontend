import React from 'react';

import { AdminOrdersPageHead, AdminOrdersPageLayout, getMainLayout, OrdersTableContainer, RenderOrdersTableProps } from '@components';
import { OrderType } from '@enums';

const ORDERS_TYPE = OrderType.CARRIER;

const OrdersPage = () => {
    return (
        <AdminOrdersPageLayout
            renderOrdersTable={({ orders, filters, paginationProps, onOrderChange }: RenderOrdersTableProps) => (
                <OrdersTableContainer
                    data={orders}
                    ordersType={ORDERS_TYPE}
                    filters={filters}
                    paginationProps={paginationProps}
                    onOrderChange={onOrderChange}
                />
            )}
            ordersType={ORDERS_TYPE}
        />
    );
};

OrdersPage.getLayout = getMainLayout({
    head: <AdminOrdersPageHead ordersType={ORDERS_TYPE} />,
    permissions: [{ scope: 'adminPanel', functionality: 'admin_panel.orders.view_any' }],
});

export default OrdersPage;
