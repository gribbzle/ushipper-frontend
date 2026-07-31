import React from 'react';

import AddressInputAutocompleteField from '@/fields/address-field/address-input-autocomplete-field';
import { FormControl, InputLabel, PrefixedField, TextField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { required as requiredValidator } from '@validators';

import { StatesSelect } from '../../rocketkor/rocketkor-form/states-select';
import { CountriesSelect } from '../countries-select/countries-select';

import { AddressFormProps } from './address-form.types';

import './address-form.scss';

const cn = classname('address-form');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:address-form');

export const AddressForm = ({ required = false, isBillingAddress = false }: AddressFormProps) => {
    return (
        <div className={cn()}>
            <PrefixedField
                name='addressLine1'
                component={AddressInputAutocompleteField}
                validate={required ? requiredValidator : undefined}
                parse={value => value}
                isAccountAddress={true}
                required={required}
                label={t(`${isBillingAddress ? 'billing-' : ''}address1`)}
            />
            <FormControl>
                <InputLabel required={required}>{t(`${isBillingAddress ? 'billing-' : ''}address2`)}</InputLabel>
                <PrefixedField name='addressLine2' component={TextField} validate={required ? requiredValidator : undefined} parse={value => value} />
            </FormControl>

            <div className={cn('row')}>
                <FormControl>
                    <InputLabel required={required}>{t('city')}</InputLabel>
                    <PrefixedField name='city' component={TextField} validate={required ? requiredValidator : undefined} parse={value => value} />
                </FormControl>
                <FormControl>
                    <InputLabel required={required}>{t('state')}</InputLabel>
                    <PrefixedField
                        name='state'
                        component={StatesSelect}
                        validate={required ? requiredValidator : undefined}
                        isClearable={!required}
                        parse={value => value}
                    />
                </FormControl>
                <PrefixedField
                    name='zipCode'
                    component={AddressInputAutocompleteField}
                    searchType='postcode'
                    isAccountAddress={true}
                    validate={required ? requiredValidator : undefined}
                    placeholder='XXXXX'
                    parse={value => value}
                    required={required}
                    label={t('zip')}
                />
            </div>
            <FormControl>
                <InputLabel required={required}>{t('country')}</InputLabel>
                <PrefixedField name='country' component={CountriesSelect} validate={required ? requiredValidator : undefined} isClearable={!required} />
            </FormControl>
        </div>
    );
};
