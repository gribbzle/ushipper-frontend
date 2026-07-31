import { useMemo } from 'react';

import { getOrderId } from '@/utils/order';
import { FundsTransferStatus, OrderStatus, OrderType } from '@enums';
import { getOrderCheckStatuses, isReceiptlessOrder } from '@utils/orders/order-payment-helpers';

import { useOrder } from './useOrder';

export const useOrderHelpers = () => {
    const order = useOrder();
    const { status, instantTermPaymentType, fundsTransferStatus, type } = order;

    const orderId = useMemo(() => getOrderId(order), [order]);

    const isDeliveredOrder = useMemo<boolean>(() => status === OrderStatus.DELIVERED, [status]);
    const isNewOrder = useMemo<boolean>(() => status === OrderStatus.NEW, [status]);
    const isPickedUpOrder = useMemo<boolean>(() => status === OrderStatus.PICKED_UP, [status]);

    const { isOrderCheckCompanyPaid, isCheckDeclined, isCheckApproval, isOrderCheckDriver } = useMemo(
        () => getOrderCheckStatuses(instantTermPaymentType),
        [instantTermPaymentType],
    );

    const isOrderFundsTransferStatusCompleted = useMemo<boolean>(() => fundsTransferStatus === FundsTransferStatus.COMPLETED, [fundsTransferStatus]);
    const isOrderFundsTransferStatusInitiated = useMemo<boolean>(() => fundsTransferStatus === FundsTransferStatus.INITIATED, [fundsTransferStatus]);
    const isAwaitingDeliveryOrder = useMemo<boolean>(() => !isDeliveredOrder, [isDeliveredOrder]);

    const isShipperOrderType = useMemo<boolean>(() => type === OrderType.SHIPPER, [type]);
    const isCarrierOrderType = useMemo<boolean>(() => type === OrderType.CARRIER, [type]);

    const receiptlessOrder = useMemo(() => isReceiptlessOrder(instantTermPaymentType), [instantTermPaymentType]);

    return {
        isNewOrder,
        isPickedUpOrder,
        isDeliveredOrder,
        isOrderCheckCompanyPaid,
        isCheckDeclined,
        isCheckApproval,
        isOrderCheckDriver,
        isOrderFundsTransferStatusCompleted,
        isOrderFundsTransferStatusInitiated,
        isAwaitingDeliveryOrder,
        isShipperOrderType,
        isCarrierOrderType,
        receiptlessOrder,
        orderId,
    };
};
