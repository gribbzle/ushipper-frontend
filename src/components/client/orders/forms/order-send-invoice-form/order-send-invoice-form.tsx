import React, { useCallback, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { DatePicker, FormControl, InputLabel, StringInput } from '@fields';
import { useAppDispatch } from '@store';
import { OrderSendInvoiceFormState, useCreateOrderInvoiceMutation, useSendOrderInvoiceMutation } from '@store/api/order-invoice-api';
import { ordersApi } from '@store/api/orders-api';
import { OrderFormEnum } from '@store/client';
import { classname, translateByNamespace } from '@utils';
import { composeValidators, emailValidator, required } from '@validators';

import './order-send-invoice-form.scss';

const t = translateByNamespace('client:orders-page:order-send-invoice-drawer:form');
const cn = classname('order-send-invoice-form');

type OrderSendInvoiceFormProps = {
    publicOrderId: string | null;
    customerName: string | null;
    onAfterFormSubmit: () => void;
};

export const OrderSendInvoiceForm = ({ publicOrderId, customerName, onAfterFormSubmit }: OrderSendInvoiceFormProps) => {
    const dispatch = useAppDispatch();

    const [createInvoice] = useCreateOrderInvoiceMutation();
    const [sendInvoice] = useSendOrderInvoiceMutation();

    const handleSubmit = useCallback(
        async (values: OrderSendInvoiceFormState) => {
            if (!publicOrderId) {
                return;
            }

            try {
                const invoice = await createInvoice(publicOrderId).unwrap();

                await sendInvoice({ publicOrderId, invoiceId: invoice.publicId, data: values })
                    .unwrap()
                    .then(() => {
                        dispatch(
                            ordersApi.util.invalidateTags([
                                { type: 'Orders', id: publicOrderId },
                                { type: 'Orders', id: 'LIST' },
                                { type: 'OrdersStatisticsCounters', id: 'LIST' },
                            ]),
                        );
                    });

                toast.success(t<string>('success-message'));

                onAfterFormSubmit();
            } catch {
                toast.error(t<string>('error-message'));
            }
        },
        [dispatch, createInvoice, sendInvoice, onAfterFormSubmit, publicOrderId],
    );

    const initialValues = useMemo<OrderSendInvoiceFormState>(
        () => ({
            invoiceAt: new Date().toISOString(),
        }),
        [],
    );

    return (
        <Form<OrderSendInvoiceFormState>
            onSubmit={handleSubmit}
            initialValues={initialValues}
            render={({ handleSubmit }) => (
                <form className={cn()} id={OrderFormEnum.SEND_INVOICE} onSubmit={handleSubmit}>
                    {customerName && (
                        <FormControl>
                            <InputLabel>{t('customer-label')}</InputLabel>
                            <label className={cn('name')}>{customerName}</label>
                        </FormControl>
                    )}
                    <Field name='invoiceId' label={t('invoice-id-field-label')} component={StringInput} />
                    <FormControl>
                        <InputLabel required={true}>{t('invoice-date-field-label')}</InputLabel>
                        <Field name='invoiceAt' component={DatePicker} validate={required} />
                    </FormControl>
                    <Field
                        name='email'
                        label={t('email-field-label')}
                        placeholder={t('email-field-placeholder')}
                        component={StringInput}
                        validate={composeValidators(required, emailValidator)}
                        required={true}
                    />
                </form>
            )}
        />
    );
};
