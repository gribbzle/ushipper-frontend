import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { OrderStatus } from '@/enums/order-status';
import { useAppDispatch, useAppSelector } from '@store';
import { usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { markAsPickedUpPopupSelector, orderPublicIdSelector, ordersActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const translateOrder = translateByNamespace('client:order');
const t = translateByNamespace('client:orders-page:mark-as-picked-up-popup');

export const MarkAsPickedUpPopup = () => {
    const dispatch = useAppDispatch();

    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();

    const fetchedOrderPublicId = useAppSelector(orderPublicIdSelector);
    const { isVisible, publicOrderId } = useAppSelector(markAsPickedUpPopupSelector);

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setMarkAsPickedUpPopupProps({ isVisible: false, publicOrderId: null }));
    }, [dispatch]);

    const handleConfirm = useCallback(() => {
        if (publicOrderId) {
            partiallyUpdateOrder({ publicOrderId, newOrderData: { status: OrderStatus.PICKED_UP } })
                .unwrap()
                .then(order => {
                    handleClose();
                    toast.success(translateOrder('mark-as-picked-up-order-success-notification') as string);

                    if (fetchedOrderPublicId) {
                        dispatch(ordersActions.setOrderData(order));
                    }
                })
                .catch(() => {
                    toast.error(translateOrder('update-error-notification') as string);
                });
        }
    }, [publicOrderId, fetchedOrderPublicId, dispatch, partiallyUpdateOrder, handleClose]);

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
