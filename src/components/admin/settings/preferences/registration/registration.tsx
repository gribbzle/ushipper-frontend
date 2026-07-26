import React from 'react';

import { RegistrationTypesSelect } from '@/components/common/registration-types-select';
import { FieldPrefix, FormControl, InputLabel, PrefixedField } from '@fields';
import { translateByNamespace } from '@utils';
import { required } from '@validators';

import { PreferencesFormPaper } from '../preferences-form-paper';

const t = translateByNamespace('admin:preferences-page:registration');

export const confirmationMethodsMap = new Map<string, string>([
    ['shipper', t('confirmation-methods.shipper-label')],
    ['carrier', t('confirmation-methods.carrier-label')],
    ['dispatcher', t('confirmation-methods.dispatcher-label')],
    ['driver', t('confirmation-methods.driver-label')],
]);

export const RegistrationPreferences = () => (
    <PreferencesFormPaper context='registration' formName='registration-form'>
        {Array.from(confirmationMethodsMap.entries()).map(([name, label]) => (
            <FieldPrefix key={name} prefix='registration.confirmationMethods'>
                <FormControl>
                    <InputLabel>{label}</InputLabel>
                    <PrefixedField name={name} component={RegistrationTypesSelect} validate={required} isClearable={false} allOptions={name === 'carrier'} />
                </FormControl>
            </FieldPrefix>
        ))}
    </PreferencesFormPaper>
);
