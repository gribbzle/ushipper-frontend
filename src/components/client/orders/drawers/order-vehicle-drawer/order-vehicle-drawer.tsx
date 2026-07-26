import React, { useCallback } from 'react';

import { Button, Drawer, OrderVehicleForm } from '@components';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { ordersActions, orderVehicleDrawerPropsSelector } from '@store/common';
import { classname, translateByNamespace } from '@utils';

const formId = 'orderPickupInformationForm';
const t = translateByNamespace('client:order:vehicles');
const cn = classname('order-vehicle-drawer');

export const OrderVehicleDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, vehicleId } = useAppSelector(orderVehicleDrawerPropsSelector);

    const isEditMode = !!vehicleId;

    const handleClose = useCallback(() => {
        dispatch(
            ordersActions.setOrderVehicleDrawerProps({
                isVisible: false,
                vehicleId: null,
            }),
        );
    }, [dispatch]);

    const handleAfterVehicleFormSubmit = useCallback(() => handleClose(), [handleClose]);

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleClose}
            head={isEditMode ? t('edit-header') : t('add-header')}
            body={<OrderVehicleForm formId={formId} vehicleId={vehicleId} onAfterFormSubmit={handleAfterVehicleFormSubmit} />}
            actions={
                <Button type='submit' form={formId} view='primary'>
                    <CheckIcon /> {t('save-btn-label')}
                </Button>
            }
        />
    );
};
