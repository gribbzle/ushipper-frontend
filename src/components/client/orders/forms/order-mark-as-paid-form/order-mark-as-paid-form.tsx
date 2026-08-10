import React, { useCallback, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { toast } from 'react-toastify';

import { PaymentMethodsSelect } from '@/components/common/payment-methods-select/payment-methods-select';
import { PaymentTerm } from '@/enums';
import {CurrencyInput} from '@/fields/currency-input';
import {DatePicker} from '@/fields/datepicker';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {PrefixedField} from '@/fields/field-prefix';
import {StringInput} from '@/fields/string-input';
import {TextField} from '@/fields/text-field';
import { useAppDispatch } from '@store';
import { OrderMarkAsPaidFormState, useCreateOrderPaymentMutation } from '@store/api/order-payment-api';
import { ordersApi } from '@store/api/orders-api';
import { OrderFormEnum } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import './order-mark-as-paid-form.scss';

const t = translateByNamespace('client:orders-page:mark-order-as-paid-drawer:form');
const cn = classname('order-mark-as-paid-form');

type Props = {
    initialValues: OrderMarkAsPaidFormState;
    onAfterFormSubmit: () => void;
};

type OrderMarkAsPaidFormContentProps = {
    isPrefixedField?: boolean;
};

export const OrderMarkAsPaidFormContent = ({ isPrefixedField = false }: OrderMarkAsPaidFormContentProps) => {
    const FieldComponent = useMemo(() => (isPrefixedField ? PrefixedField : Field), [isPrefixedField]);

    return (
        <>
            <FormControl>
                <InputLabel required={true}>{t('paid-amount-field-label')}</InputLabel>
                <FieldComponent name='paidAmount' component={CurrencyInput} startAdornment='$' parse={value => value} validate={required} />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('paid-method-field-label')}</InputLabel>
                <FieldComponent
                    name='paidMethod'
                    component={PaymentMethodsSelect}
                    validate={required}
                    displayAllOptions={true}
                    isClearable={false}
                    selectedPaymentTerm={PaymentTerm.OTHER}
                />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('receipt-date-field-label')}</InputLabel>
                <FieldComponent name='receiptAt' component={DatePicker} validate={required} parse={value => value} />
            </FormControl>
            <FormControl>
                <InputLabel>{t('reference-number-field-label')}</InputLabel>
                <FieldComponent name='referenceNumber' component={TextField} />
            </FormControl>
            <FieldComponent name='paymentTerms' label={t('payment-terms-field-label')} component={StringInput} textarea={true} />
        </>
    );
};

export const OrderMarkAsPaidForm = ({ initialValues, onAfterFormSubmit }: Props) => {
    const { orderId } = initialValues;

    const dispatch = useAppDispatch();
    const [createPayment] = useCreateOrderPaymentMutation();

    const handleOrderMarkAsPaidFormSubmit = useCallback(
        async (values: OrderMarkAsPaidFormState) => {
            if (!orderId) {
                return;
            }

            try {
                await createPayment({ ...values }).unwrap();
                onAfterFormSubmit();
                toast.success(t<string>('mark-as-paid-success-message'));
                dispatch(ordersApi.util.invalidateTags([{ type: 'Orders', id: orderId }]));
            } catch {
                toast.error(t<string>('mark-as-paid-error-message'));
            }
        },
        [orderId, createPayment, onAfterFormSubmit, dispatch],
    );

    return (
        <Form<OrderMarkAsPaidFormState>
            onSubmit={handleOrderMarkAsPaidFormSubmit}
            initialValues={initialValues}
            render={({ handleSubmit }) => (
                <form className={cn()} id={OrderFormEnum.MARK_AS_PAID} onSubmit={handleSubmit}>
                    <OrderMarkAsPaidFormContent />
                </form>
            )}
        />
    );
};
