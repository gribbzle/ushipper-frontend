import React, { useCallback, useMemo, useRef } from 'react';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { useSelector } from 'react-redux';

import { Button, Drawer, OrderDetailsFieldsGroup, OrderForm } from '@components';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { orderDetailsDrawerPropsSelector, orderDetailsSelector, OrderFormState, ordersActions } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import './order-details-drawer.scss';

const t = translateByNamespace('client:order:details');
const cn = classname('order-details-drawer');

export const OrderDetailsDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible } = useAppSelector(orderDetailsDrawerPropsSelector);
    const details = useSelector(orderDetailsSelector);
    const formRef = useRef<FormApi<OrderFormState>>();

    const handleDrawerClose = useCallback(() => {
        dispatch(ordersActions.setOrderDetailsDrawerProps({ isVisible: false }));
    }, [dispatch]);

    const initialValues = useMemo(() => {
        if (details) {
            return {
                orderId: details.orderId,
                internalOrderId: details.internalOrderId,
                inspectionType: details.inspectionType,
                trailerType: details.trailerType,
            };
        }
    }, [details]);

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={t('header')}
            body={
                <OrderForm initialValues={{ details: initialValues }} afterSubmit={handleDrawerClose}>
                    <FormSpy>
                        {props => {
                            formRef.current = props.form;

                            return null;
                        }}
                    </FormSpy>
                    <OrderDetailsFieldsGroup isFulled={false} />
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
