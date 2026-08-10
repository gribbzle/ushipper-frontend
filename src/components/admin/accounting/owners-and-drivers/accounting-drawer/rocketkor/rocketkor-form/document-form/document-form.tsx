import React from 'react';
import { Field } from 'react-final-form';

import {DatePicker} from '@/fields/datepicker';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, required, validateDateBeforeToday, validateDateNotBeforeToday } from '@validators';

import { CountriesSelect } from '../../../common/countries-select';
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
