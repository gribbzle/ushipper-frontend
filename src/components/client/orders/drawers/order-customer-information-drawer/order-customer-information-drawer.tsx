import React, { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { useSelector } from 'react-redux';

import { Button, Drawer, OrderCustomerInformationFieldsGroup, OrderForm } from '@components';
import { useMeCarrier } from '@hooks';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import {
    orderCustomerInformationDrawerPropsSelector,
    orderCustomerInformationSelector,
    OrderFormState,
    orderPublicIdSelector,
    ordersActions,
} from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './order-customer-information-drawer.scss';

const t = translateByNamespace('client:order:customer-information');
const cn = classname('order-customer-information-drawer');

export const OrderCustomerInformationDrawer = () => {
    const dispatch = useAppDispatch();
    const orderId = useSelector(orderPublicIdSelector);
    const { isVisible } = useAppSelector(orderCustomerInformationDrawerPropsSelector);
    const customerInformation = useSelector(orderCustomerInformationSelector);
    const isMeCarrier = useMeCarrier();
    const formRef = useRef<FormApi<OrderFormState>>();

    const handleDrawerClose = useCallback(() => {
        dispatch(
            ordersActions.setCustomerInformationDrawerProps({
                isVisible: false,
                customerName: null,
                streetAddress: null,
                city: null,
                state: null,
                zip: null,
                fullName: null,
                phone: null,
                email: null,
                mcNumber: null,
                businessType: null,
            }),
        );
    }, [dispatch]);

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={isMeCarrier ? t('broker-header') : t('header')}
            body={
                <OrderForm initialValues={{ publicId: orderId, customerInformation }} afterSubmit={handleDrawerClose}>
                    <FormSpy>
                        {props => {
                            formRef.current = props.form;

                            return null;
                        }}
                    </FormSpy>
                    <OrderCustomerInformationFieldsGroup hideContactInfoFooter={true} />
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
