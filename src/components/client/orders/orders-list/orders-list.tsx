import React, { memo, ReactElement } from 'react';

import { Load } from '@store/client';
import { classname } from '@utils/classname';

import './orders-list.scss';

type OrdersListProps = {
    orders: Load[];
    OrderItem: (props: { order: Load }) => ReactElement;
};

const cn = classname('orders-list');

export const OrdersList = memo(({ orders, OrderItem }: OrdersListProps) => (
    <div className={cn()}>
        {orders.map(order => (
            <OrderItem key={order.publicId} order={order} />
        ))}
    </div>
));

OrdersList.displayName = 'OrdersList';
