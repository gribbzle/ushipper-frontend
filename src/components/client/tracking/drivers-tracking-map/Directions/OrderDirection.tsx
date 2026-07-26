import React from 'react';

import { useDriverTrackingMap } from '@hooks';
import { OrderTrackingProvider } from '@providers';

import { Direction } from './Direction';

export const OrderDirection = (): JSX.Element | null => {
    const {
        config: { order },
    } = useDriverTrackingMap();

    if (!order) {
        return null;
    }

    return (
        <OrderTrackingProvider value={order} key={order.publicId}>
            <Direction />
        </OrderTrackingProvider>
    );
};
