import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { CompanyStatusesSelect } from '@/components/common/company-statutes-select/company-statuses-select';
import { CompanyTypesSelect } from '@/components/common/company-types-select/company-types-select';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {TextField} from '@/fields/text-field';
import { useHandleFiltersChange } from '@/hooks/filters/use-handle-filters-change';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';

import './companies-filters.scss';

const t = translateByNamespace('admin:companies-page:filters');
const cn = classname('companies-filters');

type CompaniesFiltersFormState = {
    name?: string;
    phone?: string;
    email?: string;
    type?: string;
    status?: string;
};

export const CompaniesFilters = () => {
    const {
        filters: { name, phone, email, type, status },
    } = useQueryFilters<CompaniesFiltersFormState>();

    const handleFiltersChange = useHandleFiltersChange<CompaniesFiltersFormState>({ resetPageOnChange: true });

    const initialValues = useMemo<CompaniesFiltersFormState>(() => ({ name, phone, email, type, status }), [name, phone, email, type, status]);

    return (
        <div className={cn()}>
            <Form<CompaniesFiltersFormState>
                onSubmit={handleFiltersChange}
                initialValues={initialValues}
                subscription={{ values: true }}
                render={({ handleSubmit }) => (
                    <form className={cn('form')} onSubmit={handleSubmit}>
                        <FormValuesSpy onChange={handleFiltersChange} debounceTime={300} />
                        <FormControl>
                            <InputLabel>{t('name-field-label')}</InputLabel>
                            <Field name='name' component={TextField} parse={parseField} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('phone-field-label')}</InputLabel>
                            <Field name='phone' component={TextField} parse={parseField} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('email-field-label')}</InputLabel>
                            <Field name='email' component={TextField} parse={parseField} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('type-field-label')}</InputLabel>
                            <Field name='type' component={CompanyTypesSelect} parse={parseField} />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('status-field-label')}</InputLabel>
                            <Field name='status' component={CompanyStatusesSelect} parse={parseField} />
                        </FormControl>
                    </form>
                )}
            />
        </div>
    );
};
