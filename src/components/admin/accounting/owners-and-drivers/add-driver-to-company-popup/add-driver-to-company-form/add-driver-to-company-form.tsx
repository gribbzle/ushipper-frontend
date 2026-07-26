import React from 'react';
import { Field, Form } from 'react-final-form';

import { CompanyType } from '@/enums';
import { AsyncCompanySelect, AsyncUserSelect } from '@components';
import { FormControl, InputLabel, SelectField, TextField } from '@fields';
import { classname, FormValuesSpy, parseField, translateByNamespace } from '@utils';
import { composeValidators, emailValidator, required } from '@validators';

import { AddDriverToCompanyFormProps, AddDriverToCompanyFormState } from './add-driver-to-company-form.types';
import { useAddDriverToCompanyForm } from './use-add-driver-to-company-form';

import './add-driver-to-company-form.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:add-driver-to-company-popup:form');
const cn = classname('add-driver-to-company-form');

export const AddDriverToCompanyForm = ({ formRef, onAfterSubmit }: AddDriverToCompanyFormProps) => {
    const { initialValues, rolesOptions, onSubmit, onChangeHandler } = useAddDriverToCompanyForm({ onAfterSubmit, formRef });

    return (
        <Form<AddDriverToCompanyFormState>
            subscription={{ values: true }}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ form, values: { companyId, roleId } }) => {
                formRef.current = form;

                return (
                    <form className={cn()}>
                        <FormValuesSpy onChange={onChangeHandler} debounceTime={300} />
                        <FormControl>
                            <InputLabel required={true}>{t('driver-name-label')}</InputLabel>
                            <Field name='name' parse={parseField} component={TextField} validate={required} placeholder='' disabled={true} />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('driver-email-label')}</InputLabel>
                            <Field
                                name='email'
                                component={TextField}
                                validate={composeValidators(required, emailValidator)}
                                autocomplete='off'
                                placeholder=''
                                parse={parseField}
                                disabled={true}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('company-label')}</InputLabel>
                            <Field
                                parse={parseField}
                                name='companyId'
                                placeholder=''
                                component={AsyncCompanySelect}
                                onlyPartnerCompanies={true}
                                isClearable={true}
                                companyType={CompanyType.CARRIER}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel required={true}>{t('role-label')}</InputLabel>
                            <Field
                                disabled={!companyId}
                                name='roleId'
                                parse={parseField}
                                component={SelectField}
                                options={rolesOptions}
                                validate={required}
                                isClearable={true}
                                placeholder={t('role-placeholder')}
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel>{t('parent-label')}</InputLabel>
                            <Field
                                disabled={!roleId}
                                name='parentUserId'
                                parse={parseField}
                                component={AsyncUserSelect}
                                superiorsForRoleId={roleId}
                                companyId={companyId}
                                isClearable={true}
                                placeholder={t('parent-placeholder')}
                            />
                        </FormControl>
                    </form>
                );
            }}
        />
    );
};
