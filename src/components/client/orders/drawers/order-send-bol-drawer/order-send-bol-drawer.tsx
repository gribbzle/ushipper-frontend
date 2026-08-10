import React, { useCallback, useMemo } from 'react';

import { OrderSendBOLForm } from '@/components/client/orders/forms/order-send-bol-form/order-send-bol-form';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { useHandleViewBol } from '@/hooks/order';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderFormEnum, ordersActions, orderSendBOLDrawerPropsSelector } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-send-bol-drawer.scss';
import EyeIcon from '@/assets/icons/eye.svg';
import SendIcon from '@/assets/icons/send.svg';

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
