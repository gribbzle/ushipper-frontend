import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { useAppDispatch, useAppSelector } from '@store';
import { useDeleteOrderCommodityMutation } from '@store/api/order-commodity-api';
import { ordersApi } from '@store/api/orders-api';
import { deleteOrderCommodityPopupSelector, orderPublicIdSelector, ordersActions } from '@store/common';
import { classname } from '@utils/classname';
import { getFullNameOfCommodity } from '@utils/commodity';
import { translateByNamespace } from '@utils/i18n';

import './delete-order-commodity-popup.scss';

const t = translateByNamespace('client:popups:delete-commodity');
const cn = classname('delete-order-commodity-popup');

export const DeleteOrderCommodityPopup = () => {
    const dispatch = useAppDispatch();
    const orderId = useAppSelector(orderPublicIdSelector) as string;
    const { isVisible, commodityDescription, commodityId, commodityName } = useAppSelector(deleteOrderCommodityPopupSelector);

    const [deleteOrderCommodity, { isLoading }] = useDeleteOrderCommodityMutation();

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setDeleteOrderCommodityPopupProps({ isVisible: false, commodityId: null, commodityDescription: null, commodityName: null }));
    }, [dispatch]);

    const handleConfirm = useCallback(async () => {
        if (commodityId) {
            deleteOrderCommodity({ orderId, commodityId })
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
    }, [dispatch, deleteOrderCommodity, handleClose, orderId, commodityId]);

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
            title={t('title', { commodity: getFullNameOfCommodity({ name: commodityName, description: commodityDescription }) })}
            actions={actions}
        />
    );
};
