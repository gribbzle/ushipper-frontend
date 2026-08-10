import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { OrderStatus } from '@/enums/order-status';
import { useAppDispatch, useAppSelector } from '@store';
import { usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { markAsDeliveredPopupSelector, orderPublicIdSelector, ordersActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const translateOrder = translateByNamespace('client:order');
const t = translateByNamespace('client:orders-page:mark-as-delivered-popup');

export const MarkAsDeliveredPopup = () => {
    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();
    const dispatch = useAppDispatch();

    const fetchedOrderPublicId = useAppSelector(orderPublicIdSelector);
    const { isVisible, publicOrderId } = useAppSelector(markAsDeliveredPopupSelector);

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setMarkAsDeliveredPopupProps({ isVisible: false, publicOrderId: null }));
    }, [dispatch]);

    const handleConfirm = useCallback(() => {
        if (publicOrderId) {
            partiallyUpdateOrder({ publicOrderId: publicOrderId, newOrderData: { status: OrderStatus.DELIVERED } })
                .unwrap()
                .then(order => {
                    handleClose();
                    toast.success(translateOrder('mark-as-delivered-order-success-notification') as string);

                    if (fetchedOrderPublicId) {
                        dispatch(ordersActions.setOrderData(order));
                    }
                })
                .catch(() => {
                    toast.success(translateOrder('update-error-notification') as string);
                });
        }
    }, [publicOrderId, fetchedOrderPublicId, partiallyUpdateOrder, handleClose, dispatch]);

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='primary' onClick={handleConfirm}>
                    {t('confirm-button-label')}
                </Button>
                <Button size='small' onClick={handleClose}>
                    {t('cancel-button-label')}
                </Button>
            </>
        ),
        [handleClose, handleConfirm],
    );

    return <Popup isOpen={isVisible} onClose={handleClose} title={t('title')} description={t('description')} actions={actions} />;
};
