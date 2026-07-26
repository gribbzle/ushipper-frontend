import React, { useCallback, useMemo } from 'react';
import has from 'has-values';
import { toast } from 'react-toastify';

import { Button, Popup } from '@components';
import { useAppDispatch, useAppSelector } from '@store';
import { useDeleteOrderVehicleMutation } from '@store/api/order-vehicle-api';
import { ordersApi } from '@store/api/orders-api';
import { deleteOrderVehiclePopupSelector, orderPublicIdSelector, ordersActions } from '@store/common';
import { classname, getObjectWithoutEmptyFields, translateByNamespace } from '@utils';

import './delete-order-vehicle-popup.scss';

const t = translateByNamespace('client:popups:delete-vehicle');
const cn = classname('delete-order-vehicle-popup');

export const DeleteOrderVehiclePopup = () => {
    const dispatch = useAppDispatch();
    const orderId = useAppSelector(orderPublicIdSelector) as string;
    const { isVisible, vehicleId, vehicleMake, vehicleModel } = useAppSelector(deleteOrderVehiclePopupSelector);

    const [deleteOrderVehicle, { isLoading }] = useDeleteOrderVehicleMutation();

    const vehicleName = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                vehicleMake,
                vehicleModel,
            }),
        [vehicleMake, vehicleModel],
    );

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setDeleteOrderVehiclePopupProps({ isVisible: false, vehicleId: null, vehicleMake: null, vehicleModel: null }));
    }, [dispatch]);

    const handleConfirm = useCallback(async () => {
        if (vehicleId) {
            deleteOrderVehicle({ orderId, vehicleId })
                .unwrap()
                .then(() => {
                    dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: orderId }]));
                    handleClose();
                    toast.success(t<string>('success-text'));
                })
                .catch(() => {
                    toast.error(t<string>('error-text'));
                });
        }
    }, [deleteOrderVehicle, handleClose, orderId, vehicleId]);

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
            className={cn()}
            isOpen={isVisible}
            onClose={handleClose}
            title={t('title', { vehicle: has(vehicleName) ? Object.values(vehicleName).join(' ') : t('empty-title') })}
            actions={actions}
        />
    );
};
