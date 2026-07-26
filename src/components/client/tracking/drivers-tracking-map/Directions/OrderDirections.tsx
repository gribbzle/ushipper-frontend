import React from 'react';

import { useDriverTrackingMap } from '@hooks';
import { OrderTrackingProvider } from '@providers';

import { Direction } from './Direction';

export const OrderDirections = (): JSX.Element | null => {
    const {
        config: { orders },
    } = useDriverTrackingMap();

    if (!orders) {
        return null;
    }

    return (
        <>
            {orders.map(order => (
                <OrderTrackingProvider value={order} key={order.publicId}>
                    <Direction />
                </OrderTrackingProvider>
            ))}
        </>
    );
};
