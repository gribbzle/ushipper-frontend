import React from 'react';
import { Field, useField } from 'react-final-form';

import { Link } from '@/components/common/link/link';
import { FormControl, InputLabel, PasswordField, PhoneNumberInput, SwitchInput, TextField } from '@fields';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { composeValidators, emailValidator, passwordValidator, phoneValidator, required } from '@validators';

type Props = {
    showCompanyNameField: boolean;
};

const t = (key: string) => translateByNamespace('client:sign-up-page')(`form.account-info-step.${key}`);
const tPhoneField = translateByNamespace('common:create-edit-user-drawer');
const cn = classname('sign-up-page');

export const AccountInfo = ({ showCompanyNameField }: Props) => {
    const email = useField('email');

    return (
        <div className={cn('form-step')}>
            <h4>{t('title')}</h4>
            <p>
                {t('description')} <Link href='/'>{t('help-page')}</Link>.
            </p>
            {showCompanyNameField && (
                <FormControl>
                    <InputLabel required={true}>{t('company-name-label')}</InputLabel>
                    <Field name='companyName' component={TextField} placeholder={t('company-name-placeholder')} validate={required} />
                </FormControl>
            )}
            <FormControl>
                <InputLabel required={true}>{t('first-name-label')}</InputLabel>
                <Field name='firstName' component={TextField} placeholder={t('first-name-placeholder')} validate={required} />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('last-name-label')}</InputLabel>
                <Field name='lastName' component={TextField} label={t('last-name-label')} placeholder={t('last-name-placeholder')} validate={required} />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('email-label')}</InputLabel>
                <Field name='email' component={TextField} placeholder={t('email-placeholder')} validate={composeValidators(required, emailValidator)} />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{tPhoneField('phone-field-label')}</InputLabel>
                <Field
                    name='phone'
                    component={PhoneNumberInput}
                    placeholder={tPhoneField('phone-field-placeholder')}
                    validate={composeValidators(required, phoneValidator)}
                />
            </FormControl>
            <FormControl>
                <InputLabel required={true}>{t('password-label')}</InputLabel>
                <PasswordField
                    name='password'
                    placeholder={t('password-placeholder')}
                    validate={composeValidators(required, passwordValidator(email.input.value))}
                />
            </FormControl>
            <Field
                name='userAgreesWithTerms'
                component={SwitchInput}
                label={
                    <>
                        {t('terms-label')} <Link href='/'>{t('terms-link')}</Link>
                    </>
                }
                validate={required}
            />
        </div>
    );
};
