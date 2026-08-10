import React from 'react';
import { Field, Form } from 'react-final-form';

import { PaymentMethodsSelect } from '@/components/common/payment-methods-select/payment-methods-select';
import { DriverInstantTermPaymentTypeSelect } from '@/components/common/selects/driver-instant-term-payment-type-select/driver-instant-term-payment-type-select';
import { InstantTermPaymentType, PaymentMethod, PaymentTerm } from '@/enums';
import {FileUploaderField} from '@/fields/file-uploader';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { OrderDriverPaymentFormState } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required } from '@validators';

import { AttachmentsDropzone } from '../attachments-form/attachments-dropzone';

import { OrderDriverPaymentFormProps } from './order-driver-payment-form.types';
import { useOrderDriverPaymentForm } from './use-order-driver-payment-form';

import './order-driver-payment-form.scss';

const t = translateByNamespace('client:order:driver-payment-form:fields');
const cn = classname('order-driver-payment-form');

export const OrderDriverPaymentForm = ({
    formRef,
    orderId,
    instantTermPaymentType,
    instantTermPaymentMethod,
    onAfterFormSubmit,
    file,
}: OrderDriverPaymentFormProps) => {
    const { handleFormSubmit, initialValues, hasAttachmentsDropzone, setHasAttachmentsDropzone } = useOrderDriverPaymentForm({
        orderId,
        onAfterFormSubmit,
        file,
        instantTermPaymentType,
        instantTermPaymentMethod,
    });

    return (
        <Form<OrderDriverPaymentFormState>
            initialValues={initialValues}
            onSubmit={handleFormSubmit}
            render={({ handleSubmit, values, form }) => {
                formRef.current = form;

                return (
                    <form className={cn()} onSubmit={handleSubmit}>
                        <FormControl>
                            <InputLabel required={true}>{t('instant-term-payment-type-label')}</InputLabel>
                            <Field
                                name='instantTermPaymentType'
                                placeholder={t('instant-term-payment-type-placeholder')}
                                component={DriverInstantTermPaymentTypeSelect}
                                validate={required}
                                parse={value => value}
                            />
                        </FormControl>
                        {values.instantTermPaymentType === InstantTermPaymentType.RECIPIENT_COMPANY && (
                            <>
                                <FormControl>
                                    <InputLabel required={true}>{t('instant-term-payment-method-label')}</InputLabel>
                                    <Field
                                        component={PaymentMethodsSelect}
                                        selectedPaymentTerm={PaymentTerm.COD}
                                        without={[PaymentMethod.CASH, PaymentMethod.OTHER]}
                                        name='instantTermPaymentMethod'
                                        placeholder={t('instant-term-payment-method-placeholder')}
                                        validate={required}
                                        parse={value => value}
                                    />
                                </FormControl>
                                {!!values.instantTermPaymentMethod && (
                                    <FormControl>
                                        <InputLabel>{t('file-label')}</InputLabel>

                                        {hasAttachmentsDropzone ? (
                                            <AttachmentsDropzone
                                                label={t('upload-file')}
                                                onDeleteFile={() => setHasAttachmentsDropzone(false)}
                                                files={file ? [file] : []}
                                                isMultiFiles={false}
                                            />
                                        ) : (
                                            <Field name='receipts' label={t('upload-file-label')} component={FileUploaderField} isMultiFiles={false} />
                                        )}
                                    </FormControl>
                                )}
                            </>
                        )}
                    </form>
                );
            }}
        />
    );
};
