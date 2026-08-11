import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { isString } from '@/shared/type-guards';
import { FieldValidator } from '@/validators/types';
import {TextField} from '@/fields/text-field';
import { MassPayUserAttributeDTO } from '@store/api/accounts-api';
import { translateByNamespace } from '@utils/i18n';

import {
    AccountPaymentMethodTypesSelect,
    AttributeOptionsSelect,
    CardExpirationDateInput,
    DateOfBirthInput,
    IdentificationNumberInput,
    RoutingNumberInput,
} from './fields';

export type FieldConfig = {
    label?: string;
    component: React.ComponentType<any>;
    validate?: FieldValidator;
    disabled?: boolean;
    type?: string;
    validation?: string;
};

const t = translateByNamespace('admin:accounting:initiate-account-payment-methods-popup:fields');

const fieldConfigMap: Record<string, { component: React.ComponentType<any>; type?: string; disabled?: boolean }> = {
    paymentMethodType: { component: AccountPaymentMethodTypesSelect, disabled: true },
    IdentificationNumber: { component: IdentificationNumberInput },
    DateOfBirth: { component: DateOfBirthInput },
    BankRoutingNumber: { component: RoutingNumberInput },
    CardExpiration: { component: CardExpirationDateInput },
};

const customValidationMessages: Record<string, string> = {
    BankRoutingNumber: t('only-9-digits-error'),
    IdentificationNumber: t('identification-number-validation-error'),
    SWIFT: t('swift-error'),
    BillReferenceNumber: t('max-characters-error'),
    CardNumber: t('only-digits-error'),
    CardZip: t('zip-code-error'),
    CardExpiration: t('card-expiration-error'),
};

export const getFieldConfig = (name: string, attribute?: MassPayUserAttributeDTO): FieldConfig => {
    const { label: dataLabel, validation, inputType } = attribute || {};
    const label = dataLabel || t(`${toKebabCase(name)}`);
    const baseConfig = fieldConfigMap[name] || { component: TextField };
    const isOnlyDigitsValidation = typeof validation === 'string' && /^[^\\]*[0-9]+[^\\]*$/.test(validation);

    if (['CardNumber', 'CardZip'].includes(name)) {
        baseConfig.type = 'number';
    }

    if (name === 'BankAccountNumber' && isOnlyDigitsValidation) {
        baseConfig.type = 'number';
    }

    const validationFn: FieldValidator = value => {
        if (!value || !isString(value)) {
            return null;
        }

        if (validation) {
            const regex = new RegExp(validation);

            if (!regex.test(value)) {
                if (name === 'BankAccountNumber') {
                    if (isOnlyDigitsValidation) {
                        return t('only-digits-error');
                    }
                    if (validation?.includes('@')) {
                        return t('email-phone-number-account-error');
                    }

                    return t('bank-account-number-iban-error');
                }

                return customValidationMessages[name] || t('invalid-value');
            }
        }

        return null;
    };

    if (inputType === 'options' && validation) {
        return {
            label,
            component: AttributeOptionsSelect,
            validation,
            validate: validationFn,
        };
    }

    return {
        label,
        validate: validationFn,
        ...baseConfig,
    };
};
