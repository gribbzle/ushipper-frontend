import React, { useCallback, useEffect } from 'react';
import { Field, Form } from 'react-final-form';

import { AuthPageHeader } from '@/components/common/auth-page-header';
import { Button } from '@/components/common/button';
import { Link } from '@/components/common/link';
import { SignInErrorAlert } from '@/components/common/sign-in-error-alert';
import { classname } from '@/utils/classname';
import { translateByNamespace } from '@/utils/i18n';
import { RequestStatus } from '@/utils/redux';
import { getProjectName } from '@/utils/translate/get-project-name';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {PasswordField} from '@/fields/password-field';
import {TextField} from '@/fields/text-field';
import { useMeDispatcher, useMeDriver, useRouterForAccountChange } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { SignInFormData, signInFormSubmit, signInFormSubmitErrorMessageSelector, signInFormSubmitStatusSelector } from '@store/client';
import { required } from '@validators';

import SignInIcon from './sign-in.svg';

import './sign-in-form.scss';

type SignInFormProps = {
    passwordRecoveryLinkHref?: string;
    passwordRecoveryLinkAs?: string;
};

const t = translateByNamespace('client:sign-in-page');
const cn = classname('sign-in-form');

export const SignInForm = ({ passwordRecoveryLinkHref = '/client/password-recovery', passwordRecoveryLinkAs = '/password-recovery' }: SignInFormProps) => {
    const dispatch = useAppDispatch();

    const onSubmit = useCallback(
        (event: SignInFormData) => {
            dispatch(signInFormSubmit(event));
        },
        [dispatch],
    );

    const signUpFormSubmitStatus = useAppSelector(signInFormSubmitStatusSelector);
    const signInFormSubmitErrorMessage = useAppSelector(signInFormSubmitErrorMessageSelector);

    const { redirectToStartPage } = useRouterForAccountChange();
    const isMeDispatcher = useMeDispatcher();
    const isMeDriver = useMeDriver();

    useEffect(() => {
        if (signUpFormSubmitStatus === RequestStatus.SUCCESS) {
            redirectToStartPage(isMeDispatcher || isMeDriver);
        }
    }, [signUpFormSubmitStatus, redirectToStartPage, isMeDispatcher, isMeDriver]);

    return (
        <Form<SignInFormData>
            onSubmit={onSubmit}
            render={({ handleSubmit }) => {
                return (
                    <form onSubmit={handleSubmit} className={cn()}>
                        <AuthPageHeader head={t('page-title', { projectName: getProjectName() })} title={t('form.title')} />
                        <div className={cn('form-content')}>
                            <FormControl>
                                <InputLabel>{t('form.login-label')}</InputLabel>
                                <Field
                                    name='email'
                                    component={TextField}
                                    placeholder={t('form.login-placeholder')}
                                    validate={required}
                                    required={true}
                                    autoComplete='username'
                                />
                            </FormControl>

                            <div>
                                <FormControl>
                                    <InputLabel>{t('form.password-label')}</InputLabel>
                                    <PasswordField
                                        name='password'
                                        placeholder={t('form.password-placeholder')}
                                        autoComplete='current-password'
                                        validate={required}
                                    />
                                </FormControl>
                                <Link href={passwordRecoveryLinkHref} as={passwordRecoveryLinkAs} className={cn('forgot-password-link')}>
                                    {t('form.forgot-password-button')}
                                </Link>
                            </div>
                        </div>
                        <SignInErrorAlert error={signInFormSubmitErrorMessage} />
                        <div className={cn('button-container')}>
                            <Button type='submit' view='primary' disabled={signUpFormSubmitStatus === RequestStatus.PROCESSING}>
                                {t('form.sign-in-button')} <SignInIcon />
                            </Button>
                        </div>
                    </form>
                );
            }}
        />
    );
};
