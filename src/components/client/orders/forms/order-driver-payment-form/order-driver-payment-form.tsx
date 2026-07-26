import React from 'react';
import { MutableRefObject } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { DriverInstantTermPaymentTypeSelect, PaymentMethodsSelect } from '@/components/common';
import { InstantTermPaymentType, PaymentMethod, PaymentTerm } from '@/enums';
import { Attachment } from '@/shared';
import { FileUploaderField, FormControl, InputLabel } from '@fields';
import { InstantTermPaymentMethod, OrderDriverPaymentFormState } from '@store/client';
import { classname, translateByNamespace } from '@utils';
import { required } from '@validators';

import { AttachmentsDropzone } from '../attachments-form/attachments-dropzone';

import { useOrderDriverPaymentForm } from './use-order-driver-payment-form';

import './order-driver-payment-form.scss';

const t = translateByNamespace('client:order:driver-payment-form:fields');

const cn = classname('order-driver-payment-form');

export type OrderDriverPaymentFormProps = {
    instantTermPaymentType: InstantTermPaymentType | null;
    instantTermPaymentMethod?: InstantTermPaymentMethod | null;
    orderId: string | null;
    file: Attachment | null;
    formRef: MutableRefObject<FormApi<OrderDriverPaymentFormState> | undefined>;
    onAfterFormSubmit: () => void;
};

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
