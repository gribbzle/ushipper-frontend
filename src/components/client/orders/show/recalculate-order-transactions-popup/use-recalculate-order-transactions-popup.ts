import { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { toast } from 'react-toastify';

import { CancelRollbackTransactionFormState } from '@/components/admin/accounting/common/cancel-rollback-transaction-popup/cancel-rollback-transaction-popup-types';
import { useAppDispatch, useAppSelector } from '@store';
import { ordersApi, useRecalculateOrderTransactionsMutation } from '@store/api/orders-api';
import { ordersActions, recalculateOrderTransactionsPopupSelector } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:order:payment-information:recalculate-order-transactions-popup');

export const useRecalculateOrderTransactionsPopup = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<CancelRollbackTransactionFormState>>();
    const { isVisible, orderId, orderPublicId } = useAppSelector(recalculateOrderTransactionsPopupSelector);
    const [recalculateTransactions, { isLoading }] = useRecalculateOrderTransactionsMutation();

    const handleClose = useCallback(
        () => dispatch(ordersActions.setRecalculateOrderTransactionsPopupProps({ isVisible: false, orderPublicId: null, orderId: null })),
        [dispatch],
    );

    const handleSubmit = useCallback(
        async ({ cancellationNotes }: CancelRollbackTransactionFormState) => {
            if (orderPublicId) {
                try {
                    await recalculateTransactions({
                        publicId: orderPublicId,
                        cancellationNotes,
                    }).unwrap();

                    toast.success(t<string>('recalculate-success'));
                    dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: orderPublicId }]));
                    handleClose();
                } catch {
                    toast.error(t<string>('recalculate-error'));
                }
            }
        },
        [orderPublicId, recalculateTransactions, dispatch, handleClose],
    );

    const handleCancelRollbackTransactionClick = useCallback(() => formRef.current?.submit(), []);

    const title = useMemo(() => t('title', { orderId: orderId ? `#${orderId}` : '' }), [orderId]);

    return { handleCancelRollbackTransactionClick, handleSubmit, handleClose, title, isLoading, isVisible, formRef };
};
