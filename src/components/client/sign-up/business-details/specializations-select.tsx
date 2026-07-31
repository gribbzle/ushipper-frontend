import React from 'react';
import { Field } from 'react-final-form';

import { CheckboxMultiSelectInput, FormControl, InputLabel } from '@fields';
import { translateByNamespace } from '@utils/i18n';
import { requiredArray } from '@validators';

import { useSpecializationSelect } from './use-specializations-select';

const t = translateByNamespace('client:sign-up-page.form.business-details-step');

export const SpecializationSelect = () => {
    const { options } = useSpecializationSelect();

    return (
        <FormControl>
            <InputLabel required={true}>{t('specializations-label')}</InputLabel>
            <Field<number[]> name='specializations' component={props => <CheckboxMultiSelectInput {...props} options={options} />} validate={requiredArray} />
        </FormControl>
    );
};
