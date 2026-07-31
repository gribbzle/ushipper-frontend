import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { useAppDispatch, useAppSelector } from '@store';
import { usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { ordersActions, restoreOrderPopupSelector } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:orders-page:restore-order-popup');

export const RestoreOrderPopup = () => {
    const dispatch = useAppDispatch();
    const { isVisible, publicOrderId } = useAppSelector(restoreOrderPopupSelector);

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setRestoreOrderPopupProps({ isVisible: false, publicOrderId: null }));
    }, [dispatch]);

    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();
    const handleConfirm = useCallback(() => {
        if (publicOrderId) {
            partiallyUpdateOrder({ publicOrderId: publicOrderId, newOrderData: { isRestored: true } })
                .unwrap()
                .then(() => {
                    handleClose();
                    toast.success(t('restore-order-success') as string);
                })
                .catch(() => {
                    toast.error(t('restore-order-error') as string);
                });
        }
    }, [handleClose, publicOrderId, partiallyUpdateOrder]);

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
