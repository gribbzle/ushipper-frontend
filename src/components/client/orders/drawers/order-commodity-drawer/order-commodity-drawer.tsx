import React, { useCallback } from 'react';

import { OrderCommodityForm } from '@/components/client/orders/forms/order-commodity-form/order-commodity-form';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { orderCommodityDrawerPropsSelector, ordersActions } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

const formId = 'orderCommodityForm';
const t = translateByNamespace('client:order:commodities');
const cn = classname('order-commodity-drawer');

export const OrderCommodityDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, commodityId } = useAppSelector(orderCommodityDrawerPropsSelector);

    const isEditMode = !!commodityId;

    const handleClose = useCallback(() => {
        dispatch(
            ordersActions.setOrderCommodityDrawerProps({
                isVisible: false,
                commodityId: null,
            }),
        );
    }, [dispatch]);

    const handleAfterCommodityFormSubmit = useCallback(() => handleClose(), [handleClose]);

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleClose}
            head={isEditMode ? t('edit-header') : t('add-header')}
            body={<OrderCommodityForm formId={formId} commodityId={commodityId} onAfterFormSubmit={handleAfterCommodityFormSubmit} />}
            actions={
                <Button type='submit' form={formId} view='primary'>
                    <CheckIcon /> {t('save-btn-label')}
                </Button>
            }
        />
    );
};
