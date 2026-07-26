import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button, Popup } from '@components';
import { useAppDispatch, useAppSelector } from '@store';
import { useUpdateDriverMutation } from '@store/api/orders-api';
import { ordersActions, unassignDriverPopupSelector } from '@store/client';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('client:orders-page:unassign-driver-popup');

export const UnasignDriverPopup = () => {
    const dispatch = useAppDispatch();
    const { isVisible, publicOrderId } = useAppSelector(unassignDriverPopupSelector);
    const [updateDriver] = useUpdateDriverMutation();

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setUnassignDriverPopupProps({ isVisible: false, publicOrderId: null }));
    }, [dispatch]);

    const handleConfirmClick = useCallback(() => {
        if (publicOrderId) {
            updateDriver({ orderPublicId: publicOrderId, body: { driverId: null } })
                .then(() => {
                    handleClose();
                    toast.success(t('unassign-driver-success') as string);
                })
                .catch(() => {
                    toast.error(t('unassign-driver-error') as string);
                });
        }
    }, [handleClose, publicOrderId, updateDriver]);

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='primary' onClick={handleConfirmClick}>
                    {t('confirm-button-label')}
                </Button>
                <Button size='small' onClick={handleClose}>
                    {t('cancel-button-label')}
                </Button>
            </>
        ),
        [handleClose, handleConfirmClick],
    );

    return <Popup isOpen={isVisible} onClose={handleClose} title={t('title')} description={t('description')} actions={actions} />;
};
