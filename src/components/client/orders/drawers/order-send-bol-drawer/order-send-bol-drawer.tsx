import React, { useCallback, useMemo } from 'react';

import { useHandleViewBol } from '@/hooks/order';
import { Button, Drawer, OrderSendBOLForm } from '@components';
import { EyeIcon, SendIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderFormEnum, ordersActions, orderSendBOLDrawerPropsSelector } from '@store/common';
import { classname, translateByNamespace } from '@utils';

import './order-send-bol-drawer.scss';

const t = translateByNamespace('client:order:send-bol');
const cn = classname('order-send-bol-drawer');

export const OrderSendBOLDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, orderId } = useAppSelector(orderSendBOLDrawerPropsSelector);

    const handleDrawerClose = useCallback(() => {
        dispatch(ordersActions.setSendBOLDrawerProps({ isVisible: false, orderId: null }));
    }, [dispatch]);

    const handleViewBolClick = useHandleViewBol(orderId);

    const actions = useMemo(
        () => (
            <>
                <Button onClick={handleViewBolClick}>
                    <EyeIcon /> {t('preview-btn-label')}
                </Button>
                <Button view='primary' type='submit' form={OrderFormEnum.SEND_BOL}>
                    <SendIcon /> {t('send-btn-label')}
                </Button>
            </>
        ),
        [handleViewBolClick],
    );

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={t('header')}
            body={<OrderSendBOLForm orderId={orderId} onAfterFormSubmit={handleDrawerClose} />}
            actions={actions}
        />
    );
};
