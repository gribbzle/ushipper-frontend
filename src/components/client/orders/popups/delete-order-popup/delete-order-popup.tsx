import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useRedirectToOrder } from '@/hooks/order';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { Button, Popup } from '@components';
import { useAppDispatch, useAppSelector } from '@store';
import { useDeleteOrderMutation } from '@store/api/orders-api';
import { deleteOrderPopupSelector, ordersActions } from '@store/client';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:orders-page:delete-order-popup');

export const DeleteOrderPopup = () => {
    const dispatch = useAppDispatch();
    const [deleteOrder, { isLoading }] = useDeleteOrderMutation();

    const { isVisible, publicOrderId, orderId } = useAppSelector(deleteOrderPopupSelector);

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setDeleteOrderPopupProps({ isVisible: false, publicOrderId: null, orderId: null }));
    }, [dispatch]);

    const { redirectToOrders } = useRedirectToOrder({});

    const handleConfirm = useCallback(async () => {
        if (publicOrderId) {
            deleteOrder(publicOrderId)
                .unwrap()
                .then(() => {
                    toast.success(t('delete-order-success') as string);
                    handleClose();
                    redirectToOrders();
                })
                .catch(e => {
                    parseAndShowAxiosError(e, t<string>('delete-order-error'));
                });
        }
    }, [redirectToOrders, deleteOrder, handleClose, publicOrderId]);

    const actions = useMemo(
        () => (
            <>
                <Button disabled={isLoading} size='small' view='danger' onClick={handleConfirm}>
                    {t('confirm-button-label')}
                </Button>
                <Button size='small' onClick={handleClose}>
                    {t('cancel-button-label')}
                </Button>
            </>
        ),
        [handleClose, handleConfirm, isLoading],
    );

    return (
        <Popup
            isOpen={isVisible}
            onClose={handleClose}
            title={t('title', { orderId: orderId ?? 'unknown' })}
            description={t('description')}
            actions={actions}
        />
    );
};
