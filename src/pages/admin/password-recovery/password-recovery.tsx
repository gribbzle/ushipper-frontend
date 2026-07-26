import React, { useCallback, useEffect, useRef } from 'react';
import { FormApi } from 'final-form';
import Head from 'next/head';
import { Field, Form } from 'react-final-form';

import { AlertBlock, Button, getAdminAuthLayout, Link } from '@components';
import { StringInput } from '@fields';
import { ArrowRightIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { requestResetFormErrorSelector, requestResetFormSubmit, requestResetFormSubmitStatusSelector, RequestResetPasswordData } from '@store/common';
import { classname, getProjectName, renderTextWithBreakLines, RequestStatus, translateByNamespace } from '@utils';
import { composeValidators, emailValidator, required } from '@validators';

import './password-recovery.scss';

const t = translateByNamespace('admin:password-recovery-page');
const cn = classname('password-recovery-page');

const PasswordRecoveryPage = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<RequestResetPasswordData>>();

    const requestResetFormSubmitStatus = useAppSelector(requestResetFormSubmitStatusSelector);
    const requestResetFormError = useAppSelector(requestResetFormErrorSelector);

    const emailFoundValidator = useCallback((dirtySinceLastSubmit: boolean) => () => !dirtySinceLastSubmit && requestResetFormError, [requestResetFormError]);

    const onSubmit = useCallback((data: RequestResetPasswordData) => dispatch(requestResetFormSubmit(data)), [dispatch]);

    useEffect(() => {
        if (requestResetFormError) {
            formRef.current?.blur('email');
        }
    }, [requestResetFormError]);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <h1 className={cn('form-title')}>{t('form-title')}</h1>
            <h4 className={cn('form-description')}>{t('form-description')}</h4>
            {requestResetFormSubmitStatus !== RequestStatus.SUCCESS && (
                <>
                    <AlertBlock>{renderTextWithBreakLines(t('tip'))}</AlertBlock>
                    <Form
                        onSubmit={onSubmit}
                        validateOnBlur={true}
                        render={({ handleSubmit, form, dirtyFieldsSinceLastSubmit }) => {
                            formRef.current = form;

                            return (
                                <form onSubmit={handleSubmit}>
                                    <div className={cn('form-email-field')}>
                                        <Field
                                            name='email'
                                            label={t('email-field-label')}
                                            component={StringInput}
                                            placeholder={t('email-field-placeholder')}
                                            validate={composeValidators(required, emailValidator, emailFoundValidator(dirtyFieldsSinceLastSubmit.email))}
                                            required={true}
                                        />
                                    </div>
                                    <div className={cn('button-container')}>
                                        <Button type='submit' view='primary'>
                                            {t('form-submit-button')}
                                        </Button>
                                    </div>
                                    <div className={cn('sign-in-link-container')}>
                                        <Link href='/admin/sign-in'>{t('sign-in-link')}</Link>
                                    </div>
                                </form>
                            );
                        }}
                    />
                </>
            )}
            {requestResetFormSubmitStatus === RequestStatus.SUCCESS && (
                <>
                    <AlertBlock>{renderTextWithBreakLines(t('success-text'))}</AlertBlock>
                    <Link className={cn('sign-in-button-link')} href='/admin/sign-in'>
                        <Button type='button' view='primary'>
                            {t('sign-in-button')} <ArrowRightIcon />
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
};

PasswordRecoveryPage.getLayout = getAdminAuthLayout;

export default PasswordRecoveryPage;
