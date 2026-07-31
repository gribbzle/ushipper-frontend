import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Field, Form } from 'react-final-form';

import { UserRoleGroup } from '@/enums';
import { Button, getAdminAuthLayout, Link, SignInErrorAlert } from '@components';
import { FormControl, InputLabel, PasswordField, TextField } from '@fields';
import { useAppDispatch, useAppSelector, wrapper } from '@store';
import { SignInFormData, signInFormSubmit, signInFormSubmitErrorMessageSelector, signInFormSubmitStatusSelector } from '@store/client';
import { authorizedUserSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { getProjectName } from '@utils/translate/get-project-name';
import { required } from '@validators';

import './sign-in.scss';

export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
    const authorizedUser = authorizedUserSelector(store.getState());

    if (authorizedUser && authorizedUser.roleGroup === UserRoleGroup.ADMINISTRATORS) {
        return {
            redirect: {
                destination: '/admin',
                permanent: false,
            },
        };
    }

    return { props: {} };
});

const t = translateByNamespace('admin:sign-in-page');
const cn = classname('admin-sign-in-page');

const SignInPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const signInFormSubmitStatus = useAppSelector(signInFormSubmitStatusSelector);
    const signUpFormSubmitStatus = useAppSelector(signInFormSubmitStatusSelector);
    const signInFormSubmitErrorMessage = useAppSelector(signInFormSubmitErrorMessageSelector);

    const onSubmit = useCallback((data: SignInFormData) => dispatch(signInFormSubmit(data)), [dispatch]);

    useEffect(() => {
        if (signUpFormSubmitStatus === RequestStatus.SUCCESS) {
            router.push('/admin');
        }
    }, [router, signUpFormSubmitStatus]);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <Form<SignInFormData>
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <h4>{t('title')}</h4>
                        <p>{t('description')}</p>
                        <div className={cn('fields-container')}>
                            <FormControl>
                                <InputLabel required={true}>{t('login-label')}</InputLabel>
                                <Field
                                    name='email'
                                    component={TextField}
                                    placeholder={t('login-placeholder')}
                                    validate={required}
                                    required={true}
                                    autoComplete='username'
                                />
                            </FormControl>
                            <FormControl>
                                <InputLabel required={true}>{t('password-label')}</InputLabel>
                                <PasswordField name='password' placeholder={t('password-placeholder')} validate={required} autoComplete='current-password' />
                            </FormControl>
                        </div>
                        <div className={cn('forgot-password-link-container')}>
                            <Link href='/admin/password-recovery'>{t('forgot-password-link-text')}</Link>
                        </div>
                        <SignInErrorAlert error={signInFormSubmitErrorMessage} />

                        <Button type='submit' view='primary' disabled={signInFormSubmitStatus === RequestStatus.PROCESSING}>
                            {t('submit-button')}
                        </Button>
                    </form>
                )}
            />
        </div>
    );
};

SignInPage.getLayout = getAdminAuthLayout;

export default SignInPage;
