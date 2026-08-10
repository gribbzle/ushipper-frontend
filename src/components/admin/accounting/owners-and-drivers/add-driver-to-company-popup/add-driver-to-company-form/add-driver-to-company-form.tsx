import React from 'react';
import { Field, Form } from 'react-final-form';

import { AsyncCompanySelect } from '@/components/common/company-select/async-company-select';
import { AsyncUserSelect } from '@/components/common/user-select/async-user-select';
import { CompanyType } from '@/enums/company-type';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {SelectField} from '@/fields/select-field';
import {TextField} from '@/fields/text-field';
import { classname } from '@utils/classname';
import { FormValuesSpy } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';
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
