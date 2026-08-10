import React, { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { useSelector } from 'react-redux';

import { OrderCustomerInformationFieldsGroup } from '@/components/client/orders/forms/order-customer-information-fields-group/order-customer-information-fields-group';
import { OrderForm } from '@/components/client/orders/order-form/order-form';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { useMeCarrier } from '@/hooks/use-user-role-group';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import {
    orderCustomerInformationDrawerPropsSelector,
    orderCustomerInformationSelector,
    OrderFormState,
    orderPublicIdSelector,
    ordersActions,
} from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

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
