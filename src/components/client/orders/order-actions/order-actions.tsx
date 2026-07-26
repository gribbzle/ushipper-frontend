import React from 'react';

import { CarrierOrderActions } from '@/components/client/orders/order-actions/carrier-order-actions';
import { ShipperOrderActions } from '@/components/client/orders/order-actions/shipper-order-actions';
import { useMeAdmin, useMeShipper } from '@hooks';
import { Load } from '@store/client';

import { AdminOrderActions } from './admin-order-actions';

type OrderActionsProps = {
    order: Load;
    context?: 'orderItem' | 'header';
};

export const OrderActions = ({ order, context = 'header' }: OrderActionsProps) => {
    const meIsShipper = useMeShipper();
    const meIsAdmin = useMeAdmin();

    if (meIsShipper) {
        return <ShipperOrderActions order={order} isOrderItemContext={false} />;
    }

    if (meIsAdmin) {
        return <AdminOrderActions order={order} />;
    }

    return <CarrierOrderActions order={order} context={context} />;
};
