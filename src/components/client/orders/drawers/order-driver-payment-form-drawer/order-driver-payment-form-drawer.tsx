import React, { useCallback, useRef, useState } from 'react';
import { FormApi } from 'final-form';

import { OrderDriverPaymentForm } from '@/components/client/orders/forms/order-driver-payment-form/order-driver-payment-form';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { useAppDispatch, useAppSelector } from '@store';
import { orderDriverPaymentFormDrawerPropsSelector, OrderDriverPaymentFormState, ordersActions } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import CheckIcon from '@/assets/icons/check-icon.svg';

const t = translateByNamespace('client:order:driver-payment-form');

export const OrderDriverPaymentFormDrawer = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<OrderDriverPaymentFormState>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { isVisible, orderId, attachment, instantTermPaymentType, instantTermPaymentMethod } = useAppSelector(orderDriverPaymentFormDrawerPropsSelector);
    const handleDrawerClose = useCallback(() => {
        dispatch(
            ordersActions.setDriverPaymentFormDrawerProps({
                isVisible: false,
                orderId: null,
                attachment: null,
                instantTermPaymentType: null,
                instantTermPaymentMethod: null,
            }),
        );
    }, [dispatch]);

    const handleSubmitClick = useCallback(async () => {
        if (formRef.current) {
            try {
                setIsLoading(true);
                await formRef.current.submit();
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    return (
        <Drawer
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={t('send-payment-form-btn-label')}
            body={
                <OrderDriverPaymentForm
                    formRef={formRef}
                    orderId={orderId}
                    onAfterFormSubmit={handleDrawerClose}
                    file={attachment}
                    instantTermPaymentType={instantTermPaymentType}
                    instantTermPaymentMethod={instantTermPaymentMethod}
                />
            }
            actions={
                <Button onClick={handleSubmitClick} view='primary' disabled={isLoading} hasLoader={isLoading}>
                    {!isLoading && <CheckIcon />} {t('save-btn-label')}
                </Button>
            }
        />
    );
};
