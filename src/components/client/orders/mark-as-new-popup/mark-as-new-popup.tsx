import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/common/button/button';
import { Popup } from '@/components/common/popup/popup';
import { OrderStatus } from '@/enums';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { useAppDispatch, useAppSelector } from '@store';
import { ordersApi, usePartiallyUpdateOrderMutation } from '@store/api/orders-api';
import { Load, markAsNewPopupSelector, orderPublicIdSelector, ordersActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

const translateOrder = translateByNamespace('client:order');
const t = translateByNamespace('client:orders-page:mark-as-new-popup');

type Props = {
    orderListContext?: boolean;
};
export const MarkAsNewPopup = ({ orderListContext }: Props) => {
    const [partiallyUpdateOrder] = usePartiallyUpdateOrderMutation();
    const dispatch = useAppDispatch();

    const fetchedOrderPublicId = useAppSelector(orderPublicIdSelector);
    const { isVisible, publicOrderId } = useAppSelector(markAsNewPopupSelector);

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setMarkAsNewPopupProps({ isVisible: false, publicOrderId: null }));
    }, [dispatch]);

    const handleConfirm = useCallback(() => {
        if (publicOrderId) {
            partiallyUpdateOrder({ publicOrderId: publicOrderId, newOrderData: { status: OrderStatus.NEW } })
                .unwrap()
                .then(order => {
                    handleClose();
                    toast.success(translateOrder<string>('mark-as-new-order-success-notification'));

                    if (fetchedOrderPublicId && !orderListContext) {
                        dispatch(ordersActions.setOrderData(order as unknown as Load));
                    }
                    if (orderListContext) {
                        dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }]));
                    }
                })
                .catch(e => {
                    parseAndShowAxiosError(e, translateOrder<string>('update-error-notification'));
                });
        }
    }, [publicOrderId, fetchedOrderPublicId, partiallyUpdateOrder, handleClose, dispatch, orderListContext]);

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
