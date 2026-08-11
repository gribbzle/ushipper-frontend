import React from 'react';

import { OrderDriverPaymentFormAlert } from '@/components/client/orders/alerts/order-driver-payment-form-alert/order-driver-payment-form-alert';
import { useOrder } from '@/hooks/order/useOrder';
import { useOrderHelpers } from '@/hooks/order/useOrderHelpers';

export const PaymentFormAlert = ({ context }: { context?: 'admin' | 'driver' }) => {
    const order = useOrder();
    const { isAwaitingDeliveryOrder } = useOrderHelpers();

    if (isAwaitingDeliveryOrder) {
        return null;
    }

    return <OrderDriverPaymentFormAlert size='small' headerSize='small' context={context} order={order} />;
};
