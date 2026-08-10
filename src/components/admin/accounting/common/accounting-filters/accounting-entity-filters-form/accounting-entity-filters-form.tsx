import React from 'react';
import { Field, Form } from 'react-final-form';

import { AsyncMultiCompanySelect } from '@/components/common/company-select/async-multi-company-select';
import { CompanyStatusesSelect } from '@/components/common/company-statutes-select/company-statuses-select';
import { CompanyTypesSelect } from '@/components/common/company-types-select/company-types-select';
import { parseField } from '@/utils/parse-field';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';

import { AccountStatusesSelect } from '../account-statuses-select';

import { AccountingEntityFiltersFormState } from './accounting-filters-entity-form.types';
import { useAccountingEntityFiltersForm } from './use-accounting-entity-filters-form';

import './accounting-entity-filters-form.scss';

const t = translateByNamespace('admin:companies-page:filters');
const cn = classname('accounting-entity-filters-form');

export const AccountingEntityFiltersForm = () => {
    const { handleFiltersChange, isCarriersAccountingPage, isDriversPage, initialValues } = useAccountingEntityFiltersForm();

    return (
        <Form<AccountingEntityFiltersFormState>
            onSubmit={handleFiltersChange}
            initialValues={initialValues}
            subscription={{ values: true }}
            render={({ handleSubmit }) => (
                <form className={cn()} onSubmit={handleSubmit}>
                    <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                    <FormControl>
                        <InputLabel>{t('name-field-label')}</InputLabel>
                        <Field parse={parseField} name='name' component={TextField} />
                    </FormControl>
                    <FormControl>
                        <InputLabel>{t('phone-field-label')}</InputLabel>
                        <Field parse={parseField} name='phone' component={TextField} />
                    </FormControl>
                    <FormControl>
                        <InputLabel>{t('email-field-label')}</InputLabel>
                        <Field parse={parseField} name='email' component={TextField} />
                    </FormControl>
                    {isCarriersAccountingPage && (
                        <FormControl>
                            <InputLabel>{t('type-field-label')}</InputLabel>
                            <Field parse={parseField} name='type' component={CompanyTypesSelect} disabled={isCarriersAccountingPage} />
                        </FormControl>
                    )}
                    {isDriversPage ? (
                        <>
                            <FormControl>
                                <InputLabel>{t('company-field-label')}</InputLabel>
                                <Field name='companyIds' component={AsyncMultiCompanySelect} isClearable={true} />
                            </FormControl>
                            <FormControl>
                                <InputLabel>{t('status-field-label')}</InputLabel>
                                <Field parse={parseField} name='status' component={AccountStatusesSelect} />
                            </FormControl>
                        </>
                    ) : (
                        <FormControl>
                            <InputLabel>{t('status-field-label')}</InputLabel>
                            <Field parse={parseField} name='status' component={CompanyStatusesSelect} />
                        </FormControl>
                    )}
                </form>
            )}
        />
    );
};
