import React, { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { useSelector } from 'react-redux';

import { OrderDeliveryInformationFieldsGroup } from '@/components/client/orders/forms/order-delivery-information-form/order-delivery-information-fields-group';
import { OrderForm } from '@/components/client/orders/order-form/order-form';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { orderDeliveryInformationDrawerPropsSelector, orderDeliveryInformationSelector, OrderFormState, ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-delivery-information-drawer.scss';

const t = translateByNamespace('client:order:delivery-information');
const cn = classname('order-delivery-information-drawer');

export const OrderDeliveryInformationDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible } = useAppSelector(orderDeliveryInformationDrawerPropsSelector);
    const deliveryInformation = useSelector(orderDeliveryInformationSelector);
    const formRef = useRef<FormApi<OrderFormState>>();

    const handleDrawerClose = useCallback(() => {
        dispatch(
            ordersActions.setDeliveryInformationDrawerProps({
                isVisible: false,
            }),
        );
    }, [dispatch]);

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={t('header')}
            body={
                <OrderForm initialValues={{ deliveryInformation }} afterSubmit={handleDrawerClose}>
                    <FormSpy>
                        {props => {
                            formRef.current = props.form;

                            return null;
                        }}
                    </FormSpy>
                    <OrderDeliveryInformationFieldsGroup hideContactInfoFooter={true} />
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
