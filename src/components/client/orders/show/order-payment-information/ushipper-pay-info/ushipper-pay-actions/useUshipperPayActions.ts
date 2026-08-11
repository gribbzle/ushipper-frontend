import { useCallback, useMemo } from 'react';

import { useOrder } from '@/hooks/order/useOrder';
import { useOrderHelpers } from '@/hooks/order/useOrderHelpers';
import { TransactionStatusesEnum } from '@/enums/transactions/transaction-statuses-enum';
import { useOpenTransactionsPage } from '@/hooks/navigation/useOpenTransactionsPage';
import { useTransactionActionsPermission } from '@/hooks/accounting/use-transaction-actions-permission';
import { useAppDispatch } from '@store';
import { ordersActions } from '@store/client';

export const useUshipperPayActions = () => {
    const dispatch = useAppDispatch();
    const hasTransactionActionsPermission = useTransactionActionsPermission();
    const { publicId, driver, details } = useOrder();
    const { isNewOrder, isPickedUpOrder, isDeliveredOrder, orderId } = useOrderHelpers();
    const openTransactionsPage = useOpenTransactionsPage();

    const showNewTransactions = useMemo(() => driver && (isNewOrder || isPickedUpOrder), [isNewOrder, isPickedUpOrder, driver]);
    const showRegenerateTransactionBtn = useMemo(
        () => hasTransactionActionsPermission && isDeliveredOrder,
        [hasTransactionActionsPermission, isDeliveredOrder],
    );

    const viewTransactionsHandler = useCallback(() => {
        openTransactionsPage({
            ...(details?.orderId && { orderId: details?.orderId }),
            ...(showNewTransactions && { status: TransactionStatusesEnum.NEW }),
        });
    }, [details?.orderId, showNewTransactions, openTransactionsPage]);

    const recalculateTransactionsHandler = useCallback(() => {
        dispatch(
            ordersActions.setRecalculateOrderTransactionsPopupProps({
                isVisible: true,
                orderPublicId: publicId,
                orderId,
            }),
        );
    }, [dispatch, publicId, orderId]);

    return {
        recalculateTransactionsHandler,
        viewTransactionsHandler,
        showRegenerateTransactionBtn,
    };
};
