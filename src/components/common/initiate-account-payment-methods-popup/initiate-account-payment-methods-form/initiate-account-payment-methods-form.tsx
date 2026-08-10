import React from 'react';
import { toKebabCase } from 'js-convert-case';
import { Field, Form } from 'react-final-form';

import { Link } from '@/components/common/link/link';
import { MassPayUserTypesEnum } from '@/enums/account/masspay-user-types-enum';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import { classname } from '@utils/classname';
import { composeValidators, required } from '@validators';

import { InitiateAccountPaymentMethodsFormProps, InitiateAccountPaymentMethodsFormState } from './initiate-account-payment-methods-form.types';
import { useInitiateAccountPaymentMethodsForm } from './use-initiate-account-payment-methods-form';
import { getFieldConfig } from './utils';

import './initiate-account-payment-methods-form.scss';

const cn = classname('initiate-account-payment-methods-form');

export const InitiateAccountPaymentMethodsForm = ({ formRef, onAfterSubmit }: InitiateAccountPaymentMethodsFormProps) => {
    const { initialValues, fieldNames, attributes, onSubmit } = useInitiateAccountPaymentMethodsForm({ onAfterSubmit });

    return (
        <Form<InitiateAccountPaymentMethodsFormState>
            subscription={{ values: true }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ form }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        {fieldNames.map(name => {
                            const attribute = attributes?.find(attr => attr.type === name);
                            const config = getFieldConfig(name, attribute);

                            if (!config) {
                                console.error(`No config found for field: ${name}`);

                                return null;
                            }

                            const isIDSelfieCollectionField = name === 'IDSelfieCollection';

                            const classMapping: Record<string, string | undefined> = {
                                [MassPayUserTypesEnum.BILL_REFERENCE_NUMBER]: cn('double-column'),
                                paymentMethodType: cn('double-column'),
                                IDSelfieCollection: cn('link'),
                            };

                            const fieldClassName = classMapping[name] || undefined;

                            return (
                                <FormControl key={toKebabCase(name)} className={fieldClassName}>
                                    {isIDSelfieCollectionField && attribute?.value ? (
                                        <InputLabel required={!attribute?.isOptional}>
                                            <Link href={attribute.value} target='_blank' rel='noopener noreferrer'>
                                                {config.label}
                                            </Link>
                                        </InputLabel>
                                    ) : (
                                        <>
                                            <InputLabel required={!attribute?.isOptional}>{config.label}</InputLabel>
                                            <Field
                                                name={name}
                                                component={config.component}
                                                validate={composeValidators(attribute?.isOptional ? null : required, config.validate ?? null)}
                                                isClearable={attribute?.isOptional}
                                                disabled={config.disabled}
                                                type={config.type}
                                                validation={config.validation}
                                            />
                                        </>
                                    )}
                                </FormControl>
                            );
                        })}
                    </form>
                );
            }}
        />
    );
};
