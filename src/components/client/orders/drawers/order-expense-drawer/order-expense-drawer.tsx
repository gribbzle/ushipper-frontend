import React, { useCallback } from 'react';
import has from 'has-values';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { Button, Drawer, ExpenseTypesSelect, FieldCurrencyPrepend } from '@components';
import { DatePicker, FormControl, InputLabel, SimpleFileUploader, StringInput, SwitchInput } from '@fields';
import { CheckIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { OrderExpense, useCreateOrderExpenseMutation, useGetOrderExpensesQuery, useUpdateOrderExpenseMutation } from '@store/api/order-expenses-api';
import { orderExpenseDrawerPropsSelector, orderPublicIdSelector, ordersActions } from '@store/common';
import { classname, translateByNamespace } from '@utils';
import { required } from '@validators';

import './order-expense-drawer.scss';

const t = translateByNamespace('client:order:expense-drawer');
const cn = classname('order-expense-drawer');

export const OrderExpenseDrawer = () => {
    const dispatch = useAppDispatch();
    const { isVisible, expenseId } = useAppSelector(orderExpenseDrawerPropsSelector);
    const orderId = useAppSelector(orderPublicIdSelector) as string;

    const { orderExpense } = useGetOrderExpensesQuery(orderId, {
        skip: !has(orderId) || !has(expenseId),
        selectFromResult: ({ data }) => ({
            orderExpense: data?.find(expense => expense.publicId === expenseId),
        }),
    });

    const [updateOrderExpense, { isLoading: updatingOrder }] = useUpdateOrderExpenseMutation();
    const [createOrderExpense, { isLoading: creatingOrder }] = useCreateOrderExpenseMutation();

    const isEditMode = !!expenseId;

    const handleDrawerClose = useCallback(() => dispatch(ordersActions.setOrderExpenseDrawerProps({ isVisible: false, expenseId: null })), [dispatch]);

    const editOrderExpense = useCallback(
        (values: OrderExpense) => {
            if (orderId && expenseId) {
                updateOrderExpense({ orderId, expenseId, expense: values })
                    .unwrap()
                    .then(() => {
                        handleDrawerClose();
                        toast.success(t<string>('edit-expense-success-message'));
                    })
                    .catch(() => {
                        toast.error(t<string>('edit-expense-error-message'));
                    });
            }
        },
        [expenseId, orderId, handleDrawerClose, updateOrderExpense],
    );

    const addOrderExpense = useCallback(
        (values: OrderExpense) => {
            if (orderId) {
                createOrderExpense({ orderId, expense: values })
                    .unwrap()
                    .then(() => {
                        handleDrawerClose();
                        toast.success(t<string>('add-expense-success-message'));
                    })
                    .catch(() => {
                        toast.error(t<string>('add-expense-error-message'));
                    });
            }
        },
        [orderId, createOrderExpense, handleDrawerClose],
    );

    const handleSubmit = useCallback(
        (values: OrderExpense) => {
            if (isEditMode) {
                editOrderExpense(values);
            } else {
                addOrderExpense(values);
            }
        },
        [addOrderExpense, editOrderExpense, isEditMode],
    );

    return (
        <Drawer
            className={cn()}
            isOpen={isVisible}
            onClose={handleDrawerClose}
            head={isEditMode ? t('edit-expense-drawer-head') : t('add-expense-drawer-head')}
            body={
                <Form<OrderExpense>
                    initialValues={orderExpense}
                    onSubmit={handleSubmit}
                    subscription={{ values: true }}
                    render={({ handleSubmit, values }) => (
                        <form className={cn('form')} onSubmit={handleSubmit} id='orderExpenseDrawerForm'>
                            <div className={cn('form-row')}>
                                <FormControl>
                                    <InputLabel>{t('type-field-label')} </InputLabel>
                                    <Field name='type' component={ExpenseTypesSelect} required={true} validate={required} />
                                </FormControl>
                                <Field
                                    name='price'
                                    label={t('price-field-label')}
                                    component={StringInput}
                                    required={true}
                                    adornment={<FieldCurrencyPrepend />}
                                    validate={required}
                                />
                                <FormControl>
                                    <InputLabel required={true}>{t('receipt-date-field-label')}</InputLabel>
                                    <Field name='receiptAt' component={DatePicker} validate={required} required={true} parse={value => value} />
                                </FormControl>
                            </div>
                            {values.type === 'other' && (
                                <Field name='specifyType' label={t('specify-type-field-label')} component={StringInput} textarea={true} />
                            )}
                            <Field name='attachment' label={t('receipt-file-field-label')} component={SimpleFileUploader} view='dropzone' />
                            <Field name='showExpenseOnInvoice' label={t('show-expense-on-invoice-field-label')} component={SwitchInput} />
                            <Field name='deductFromDriverPay' label={t('deduct-from-driver-pay-field-label')} component={SwitchInput} />
                        </form>
                    )}
                />
            }
            actions={
                <Button type='submit' form='orderExpenseDrawerForm' view='primary' disabled={updatingOrder || creatingOrder}>
                    <CheckIcon /> {t('save-button-label')}
                </Button>
            }
        />
    );
};
