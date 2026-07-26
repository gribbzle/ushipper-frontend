import React, { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { useSelector } from 'react-redux';

import { Button, Drawer, OrderForm, OrderPaymentInformationFieldsGroup } from '@components';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import {
    OrderFormState,
    orderPaymentInformationDrawerPropsSelector,
    orderPaymentInformationSelector,
    orderPaymentSelector,
    orderPublicIdSelector,
    ordersActions,
} from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './order-payment-information-drawer.scss';

const t = translateByNamespace('client:order:payment-information');
const cn = classname('order-payment-information-drawer');

export const OrderPaymentInformationDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible } = useAppSelector(orderPaymentInformationDrawerPropsSelector);
    const paymentInformation = useSelector(orderPaymentInformationSelector);
    const payment = useSelector(orderPaymentSelector);
    const publicId = useSelector(orderPublicIdSelector);

    const formRef = useRef<FormApi<OrderFormState>>();

    const handleDrawerClose = useCallback(() => {
        dispatch(
            ordersActions.setPaymentInformationDrawerProps({
                isVisible: false,
                payment: null,
                brokerFee: null,
                method: null,
                terms: null,
                delayedPayment: null,
                delayedTerms: null,
                delayedMethod: null,
                driverPay: null,
                notes: null,
                invoiceId: null,
                invoiceNotes: null,
            }),
        );
    }, [dispatch]);

    return (
        <Drawer
            className={cn('')}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={t('header')}
            body={
                <OrderForm initialValues={{ paymentInformation, payment, publicId }} afterSubmit={handleDrawerClose}>
                    <FormSpy>
                        {props => {
                            formRef.current = props.form;

                            return null;
                        }}
                    </FormSpy>
                    <OrderPaymentInformationFieldsGroup />
                </OrderForm>
            }
            actions={
                <Button view='primary' onClick={() => formRef.current?.submit()}>
                    <CheckIcon /> {t('submit-btn-label')}
                </Button>
            }
        />
    );
};
