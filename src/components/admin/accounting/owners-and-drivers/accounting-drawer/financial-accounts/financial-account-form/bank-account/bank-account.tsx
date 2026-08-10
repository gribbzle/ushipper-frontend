import React from 'react';
import { Field, useFormState } from 'react-final-form';

import {FieldPrefix, PrefixedField} from '@/fields/field-prefix';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { useAppSelector } from '@store';
import { editFinancialAccountPopupPropsSelector } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, lengthValidator, matchAccountNumber, required, taxIdValidator } from '@validators';

import { AccountSubtypesSelect } from '../account-suptypes-select';
import { BankAccountTypeSelectionButtonGroup } from '../bank-account-type-selection-button-group';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');

export const BankAccount = () => {
    const {
        values: { bankAccount },
    } = useFormState();

    const { isPopupOpened: isEdit } = useAppSelector(editFinancialAccountPopupPropsSelector);

    return (
        <>
            <FormControl>
                <InputLabel required={true}>{t('bank-account-type')}</InputLabel>
                {isEdit ? (
                    <Field name='bankAccountType' component={AccountSubtypesSelect} disabled={isEdit} validate={required} placeholder='' />
                ) : (
                    <BankAccountTypeSelectionButtonGroup name='bankAccountType' />
                )}
            </FormControl>
            <FieldPrefix prefix='bankAccount'>
                <FormControl>
                    <InputLabel required={true}>{t('bank-name')}</InputLabel>
                    <PrefixedField name='bankName' component={TextField} validate={required} placeholder='' />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('routing-number')}</InputLabel>
                    <PrefixedField
                        name='routingNo'
                        component={TextField}
                        validate={composeValidators(required, taxIdValidator(t('routing-no-error')))}
                        placeholder=''
                        type='number'
                    />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('name-on-account')}</InputLabel>
                    <PrefixedField name='nameOnAccount' validate={required} component={TextField} placeholder='' />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('account-number')}</InputLabel>
                    <PrefixedField
                        name='accountNumber'
                        component={TextField}
                        validate={composeValidators(required, lengthValidator(4, 20))}
                        placeholder=''
                        type='number'
                    />
                </FormControl>
                {!isEdit && (
                    <FormControl>
                        <InputLabel required={true}>{t('confirm-account-number')}</InputLabel>
                        <PrefixedField
                            name='confirmAccountNumber'
                            component={TextField}
                            validate={composeValidators(required, matchAccountNumber(bankAccount?.accountNumber))}
                            placeholder=''
                            type='number'
                        />
                    </FormControl>
                )}
            </FieldPrefix>
        </>
    );
};
