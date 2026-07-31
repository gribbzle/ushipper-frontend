import React, { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { useSelector } from 'react-redux';

import { OrderPickupInformationFieldsGroup } from '@/components/client/orders/forms/order-pickup-information-fields-group/order-pickup-information-fields-group';
import { OrderForm } from '@/components/client/orders/order-form/order-form';
import { Button } from '@/components/common/button/button';
import { Drawer } from '@/components/common/drawer/drawer';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderFormState, orderPickupInformationDrawerPropsSelector, orderPickupInformationSelector, ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './order-pickup-information-drawer.scss';

const t = translateByNamespace('client:order:pickup-information');
const cn = classname('order-pickup-information-drawer');

export const OrderPickupInformationDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible } = useAppSelector(orderPickupInformationDrawerPropsSelector);
    const pickupInformation = useSelector(orderPickupInformationSelector);
    const formRef = useRef<FormApi<OrderFormState>>();

    const handleDrawerClose = useCallback(() => {
        dispatch(
            ordersActions.setPickupInformationDrawerProps({
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
                <OrderForm initialValues={{ pickupInformation }} afterSubmit={handleDrawerClose}>
                    <FormSpy>
                        {props => {
                            formRef.current = props.form;

                            return null;
                        }}
                    </FormSpy>
                    <OrderPickupInformationFieldsGroup hideContactInfoFooter={true} />
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
