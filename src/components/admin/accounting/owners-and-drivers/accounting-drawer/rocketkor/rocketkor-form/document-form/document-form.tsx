import React from 'react';
import { Field } from 'react-final-form';

import { DatePicker, FormControl, InputLabel, TextField } from '@fields';
import { classname, translateByNamespace } from '@utils';
import { composeValidators, required, validateDateBeforeToday, validateDateNotBeforeToday } from '@validators';

import { CountriesSelect } from '../../../common';
import { StatesSelect } from '../states-select';

import './document-form.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');
const cn = classname('document-form');

export const DocumentForm = () => {
    return (
        <>
            <FormControl>
                <InputLabel required={true}>{t('document-name')}</InputLabel>
                <Field name='name' component={TextField} validate={required} />
            </FormControl>
            <div className={cn('row')}>
                <FormControl>
                    <InputLabel required={true}>{t('document-number')}</InputLabel>
                    <Field name='number' component={TextField} validate={required} />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('issuing-date')}</InputLabel>
                    <Field name='issuingDate' component={DatePicker} validate={composeValidators(required, validateDateBeforeToday())} placeholder='MM/DD/YY' />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('expiry-date')}</InputLabel>
                    <Field
                        name='expiryDate'
                        component={DatePicker}
                        validate={composeValidators(required, validateDateNotBeforeToday())}
                        placeholder='MM/DD/YY'
                    />
                </FormControl>
            </div>
            <div className={cn('row')}>
                <FormControl>
                    <InputLabel required={true}>{t('issuing-country')}</InputLabel>
                    <Field name='country' component={CountriesSelect} validate={required} isClearable={false} />
                </FormControl>
                <FormControl>
                    <InputLabel required={true}>{t('state')}</InputLabel>
                    <Field name='state' component={StatesSelect} validate={required} isClearable={false} />
                </FormControl>
            </div>
            <FormControl>
                <InputLabel required={true}>{t('document-description')}</InputLabel>
                <Field name='description' component={TextField} validate={required} multiline={true} />
            </FormControl>
        </>
    );
};
