import React from 'react';

import { useOrder, useOrderHelpers } from '@/hooks/order';
import { OrderDriverPaymentFormAlert } from '@components';

export const PaymentFormAlert = ({ context }: { context?: 'admin' | 'driver' }) => {
    const order = useOrder();
    const { isAwaitingDeliveryOrder } = useOrderHelpers();

    if (isAwaitingDeliveryOrder) {
        return null;
    }

    return <OrderDriverPaymentFormAlert size='small' headerSize='small' context={context} order={order} />;
};
