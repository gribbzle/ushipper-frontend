import React, { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { useSelector } from 'react-redux';

import { Button, Drawer, OrderForm, OrderPickupInformationFieldsGroup } from '@components';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderFormState, orderPickupInformationDrawerPropsSelector, orderPickupInformationSelector, ordersActions } from '@store/client';
import { classname, translateByNamespace } from '@utils';

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
