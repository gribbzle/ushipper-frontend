import { ReactElement } from 'react';

import { TablePaginationProps } from '@components';
import { OrderType } from '@enums';
import { GetOrdersData } from '@store/api/orders-api';
import { Load } from '@store/client';

export type RenderOrdersTableProps = {
    orders: Load[];
    filters: GetOrdersData;
    paginationProps: TablePaginationProps;
    onOrderChange: (orderName: string, orderDirection: string) => void;
};

export type AdminOrdersPageLayoutProps = {
    renderOrdersTable: ({ orders, filters, onOrderChange }: RenderOrdersTableProps) => ReactElement;
    ordersType?: OrderType;
};
