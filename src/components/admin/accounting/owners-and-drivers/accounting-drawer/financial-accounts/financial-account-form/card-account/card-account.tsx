import React from 'react';
import { Field } from 'react-final-form';

import { FieldPrefix, FormControl, InputLabel, PrefixedField, TextField } from '@fields';
import { useAppSelector } from '@store';
import { editFinancialAccountPopupPropsSelector } from '@store/admin';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { cardNumberValidator, composeValidators, expiryValidator, required } from '@validators';

import { AccountSubtypesSelect } from '../account-suptypes-select';

import { CardNumberInput } from './card-number-input';
import { ExpiryInput } from './expiry-input';

import './card-account.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:financial-accounts:form');
const cn = classname('card-account');

export const CardAccount = () => {
    const { isPopupOpened: isEdit } = useAppSelector(editFinancialAccountPopupPropsSelector);

    return (
        <>
            <FormControl>
                <InputLabel required={true}>{t('card-type')}</InputLabel>
                <Field name='cardAccountType' component={AccountSubtypesSelect} validate={required} placeholder='' disabled={true} />
            </FormControl>
            <div className={cn('')}>
                <FieldPrefix prefix='card'>
                    <FormControl>
                        <InputLabel required={true}>{t('first-name-on-card')}</InputLabel>
                        <PrefixedField name='firstName' component={TextField} validate={required} placeholder='' />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={true}>{t('last-name-on-card')}</InputLabel>
                        <PrefixedField name='lastName' component={TextField} validate={required} placeholder='' />
                    </FormControl>
                    <FormControl>
                        <InputLabel>{t('middle-name-on-card')}</InputLabel>
                        <PrefixedField name='middleName' component={TextField} placeholder='' />
                    </FormControl>
                    <FormControl className={cn('card-number')}>
                        <InputLabel required={true}>{t('card-number')}</InputLabel>
                        <PrefixedField
                            name='number'
                            component={CardNumberInput}
                            validate={composeValidators(required, cardNumberValidator())}
                            hasMask={!isEdit}
                        />
                    </FormControl>
                    <FormControl>
                        <InputLabel required={true}>{t('card-exp-date')}</InputLabel>
                        <PrefixedField name='expiry' component={ExpiryInput} validate={composeValidators(required, expiryValidator())} />
                    </FormControl>
                </FieldPrefix>
            </div>
        </>
    );
};
