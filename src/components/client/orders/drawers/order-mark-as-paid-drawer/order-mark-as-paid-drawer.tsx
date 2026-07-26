import React, { useCallback, useMemo } from 'react';

import { Button, Drawer, OrderMarkAsPaidForm } from '@components';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderMarkAsPaidFormState } from '@store/api/order-payment-api';
import { OrderFormEnum, orderMarkAsPaidDrawerPropsSelector, ordersActions } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './order-mark-as-paid-drawer.scss';

const t = translateByNamespace('client:orders-page:mark-order-as-paid-drawer');
const cn = classname('order-mark-as-paid-drawer');

export const OrderMarkAsPaidDrawer = () => {
    const dispatch = useAppDispatch();
    const { orderId, isVisible } = useAppSelector(orderMarkAsPaidDrawerPropsSelector);

    const handleDrawerClose = useCallback(() => {
        dispatch(
            ordersActions.setMarkAsPaidDrawerProps({
                isVisible: false,
                orderId: null,
            }),
        );
    }, [dispatch]);

    const onAfterSubmit = useCallback(() => {
        handleDrawerClose();
    }, [handleDrawerClose]);

    const initialValues = useMemo<OrderMarkAsPaidFormState>(() => ({ orderId: orderId as string, receiptAt: new Date().toISOString() }), [orderId]);

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={t('header')}
            body={<OrderMarkAsPaidForm initialValues={initialValues} onAfterFormSubmit={onAfterSubmit} />}
            actions={
                <Button view='primary' form={OrderFormEnum.MARK_AS_PAID} type='submit'>
                    <CheckIcon /> {t('submit-btn-label')}
                </Button>
            }
        />
    );
};
