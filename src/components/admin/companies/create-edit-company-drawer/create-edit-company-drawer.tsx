import React, { useMemo } from 'react';
import { Field, Form } from 'react-final-form';

import { Button } from '@/components/common/button/button';
import { CompanyTypesSelect } from '@/components/common/company-types-select/company-types-select';
import { Divider } from '@/components/common/divider/divider';
import { Drawer } from '@/components/common/drawer/drawer';
import { SwitchInput } from '@/fields/switch-input';
import { FormControl, ImageFileInput, InputLabel, PasswordField, PhoneNumberInput, TextField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { parseField } from '@utils/parse-field';
import { composeValidators, emailValidator, passwordValidator, phoneValidator, required } from '@validators';

import { CreateEditFormState } from './create-edit-company-drawer..types';
import { useCloseCreateEditCompanyDrawer } from './use-close-create-edit-company-drawer';
import { useCreateEditCompanyDrawer } from './use-create-edit-company-drawer';
import { validateCreateEditForm } from './utils';

import './create-edit-company-drawer.scss';

const t = translateByNamespace('admin:companies-page:create-edit-company-drawer');
const cn = classname('create-edit-company-drawer');

export const CreateEditCompanyDrawer = () => {
    const { isNotVisible, onDeleteClickHandler, initialValues, onSubmitHandler, onSubmit, createEditCompanyDrawerMode, fetchedCompany, formRef } =
        useCreateEditCompanyDrawer();
    const { onCloseHandler } = useCloseCreateEditCompanyDrawer();

    const actions = useMemo(
        () => (
            <div className={cn('action-btn')}>
                {createEditCompanyDrawerMode === 'edit' && (
                    <Button view='danger' onClick={onDeleteClickHandler}>
                        {t('delete-company-button-label')}
                    </Button>
                )}
                <Button view='primary' onClick={onSubmitHandler}>
                    {createEditCompanyDrawerMode === 'create' ? t('add-company-button-label') : t('save-company-button-label')}
                </Button>
            </div>
        ),
        [createEditCompanyDrawerMode, onDeleteClickHandler, onSubmitHandler],
    );

    return (
        <Drawer
            className={cn()}
            isOpen={!isNotVisible}
            onClose={onCloseHandler}
            head={createEditCompanyDrawerMode === 'create' ? t('drawer-header-label') : fetchedCompany?.name}
            actions={actions}
            body={
                <Form<CreateEditFormState>
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validateOnBlur={true}
                    subscription={{ values: true }}
                    validate={validateCreateEditForm}
                    render={({ handleSubmit, form, values: { email } }) => {
                        formRef.current = form;

                        return (
                            <form onSubmit={handleSubmit} name='create-edit-company-form'>
                                <Divider>{t('form.company-info-section-delimeter')}</Divider>
                                <FormControl>
                                    <InputLabel required={true}>{t('form.company-name-field-label')}</InputLabel>
                                    <Field name='name' parse={parseField} component={TextField} validate={required} />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{t('form.company-type-field-label')}</InputLabel>
                                    <Field
                                        name='type'
                                        component={CompanyTypesSelect}
                                        validate={required}
                                        displayAllOptions={true}
                                        isClearable={false}
                                        disabled={createEditCompanyDrawerMode === 'edit'}
                                        parse={parseField}
                                    />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{t('form.company-email-field-label')}</InputLabel>
                                    <Field name='email' component={TextField} validate={composeValidators(required, emailValidator)} parse={parseField} />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{t('form.company-phone-field-label')}</InputLabel>
                                    <Field
                                        name='phone'
                                        component={PhoneNumberInput}
                                        placeholder='+1'
                                        validate={composeValidators(required, phoneValidator)}
                                        parse={parseField}
                                    />
                                </FormControl>
                                {createEditCompanyDrawerMode === 'edit' && fetchedCompany?.isPartner && (
                                    <FormControl>
                                        <InputLabel>{t('form.company-twilio-phone-field-label')}</InputLabel>
                                        <Field name='twilioPhone' component={PhoneNumberInput} placeholder='+1' validate={phoneValidator} parse={parseField} />
                                    </FormControl>
                                )}
                                <Field name='isActive' component={SwitchInput} label={t('form.active-field-label')} />

                                {createEditCompanyDrawerMode === 'create' && (
                                    <>
                                        <Divider>{t('form.owner-info-section-delimeter')}</Divider>
                                        <FormControl>
                                            <InputLabel required={true}>{t('form.owner-name-field-label')}</InputLabel>
                                            <Field name='ownerName' component={TextField} validate={required} parse={parseField} />
                                        </FormControl>
                                        <Field name='ownerAvatar' component={ImageFileInput} />
                                        <FormControl>
                                            <InputLabel required={true}>{t('form.owner-password-field-label')}</InputLabel>
                                            <PasswordField
                                                name='ownerPassword'
                                                placeholder=''
                                                autoComplete='new-password'
                                                validate={composeValidators(required, passwordValidator(email), passwordValidator(email))}
                                            />
                                        </FormControl>
                                        <FormControl>
                                            <InputLabel required={true}>{t('form.owner-password-confirmation-field-label')}</InputLabel>
                                            <PasswordField
                                                name='ownerPasswordConfirmation'
                                                placeholder=''
                                                autoComplete='new-password'
                                                validate={composeValidators(required, passwordValidator(email), passwordValidator(email))}
                                            />
                                        </FormControl>
                                    </>
                                )}
                            </form>
                        );
                    }}
                />
            }
        />
    );
};
