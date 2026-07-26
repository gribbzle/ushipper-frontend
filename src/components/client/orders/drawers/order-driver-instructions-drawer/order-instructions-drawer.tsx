import React, { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { FormSpy } from 'react-final-form';
import { useSelector } from 'react-redux';

import { Button, Drawer, OrderForm } from '@components';
import { FieldPrefix, FormControl, InputLabel, PrefixedField, TextField } from '@fields';
import { useMeShipper } from '@hooks';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { orderDetailsSelector, OrderFieldsGroup, OrderFormState, ordersActions, orderSetDriverInstructionsDrawerPropsSelector } from '@store/client';
import { classname, translateByNamespace } from '@utils';

const t = translateByNamespace('client:order:details:fields');
const tSubmitBtn = translateByNamespace('client:order:details');
const cn = classname('order-driver-instructions-drawer');

export const OrderInstructionsDrawer = () => {
    const isMeShipper = useMeShipper();
    const dispatch = useAppDispatch();
    const { isVisible } = useAppSelector(orderSetDriverInstructionsDrawerPropsSelector);
    const details = useSelector(orderDetailsSelector);
    const formRef = useRef<FormApi<OrderFormState>>();

    const handleDrawerClose = useCallback(() => {
        dispatch(
            ordersActions.setDriverInstructionsDrawerProps({
                isVisible: false,
            }),
        );
    }, [dispatch]);

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={isMeShipper ? t('order-instructions') : t('driver-instructions-label')}
            body={
                <OrderForm
                    afterSubmit={handleDrawerClose}
                    initialValues={{
                        details: details,
                    }}
                >
                    <FormSpy>
                        {props => {
                            formRef.current = props.form;

                            return null;
                        }}
                    </FormSpy>
                    <FieldPrefix prefix={OrderFieldsGroup.DETAILS}>
                        {isMeShipper && (
                            <FormControl>
                                <InputLabel>{t('order-instructions')}</InputLabel>
                                <PrefixedField
                                    className='driver-instructions'
                                    component={TextField}
                                    name='instructions'
                                    multiline={true}
                                    parse={value => value}
                                />
                            </FormControl>
                        )}
                        {!isMeShipper && (
                            <FormControl>
                                <InputLabel>{t('driver-instructions-label')}</InputLabel>
                                <PrefixedField
                                    className='driver-instructions'
                                    component={TextField}
                                    name='driverInstructions'
                                    multiline={true}
                                    hint={t('driver-instructions-help')}
                                    parse={value => value}
                                />
                            </FormControl>
                        )}
                    </FieldPrefix>
                </OrderForm>
            }
            actions={
                <Button view='primary' onClick={() => formRef.current?.submit()}>
                    <CheckIcon /> {tSubmitBtn('submit-btn-label')}
                </Button>
            }
        />
    );
};
