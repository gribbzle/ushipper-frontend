import React from 'react';

import { TablePaginationProps } from '@/components/common/table/table.types';
import { OrderType } from '@enums';
import { GetOrdersData } from '@store/api/orders-api';
import { Load } from '@store/client';

import { OrdersTable } from '../orders-table';

type Props = {
    data: Load[];
    ordersType: OrderType;
    filters: GetOrdersData;
    paginationProps: TablePaginationProps;
    onOrderChange: (orderName: string, orderDirection: string) => void;
};

export const OrdersTableContainer = ({ data, ordersType, filters, paginationProps, onOrderChange }: Props) => (
    <OrdersTable
        data={data}
        ordersType={ordersType}
        filters={filters}
        onOrderChange={onOrderChange}
        headerTableSticky={true}
        tablePaginationProps={paginationProps}
    />
);
