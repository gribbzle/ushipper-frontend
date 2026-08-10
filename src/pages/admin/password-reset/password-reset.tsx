import React, { useCallback, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from 'react-final-form';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { Button } from '@/components/common/button/button';
import { getAdminAuthLayout } from '@/components/admin/auth-layout/auth-layout';
import { Link } from '@/components/common/link/link';
import { FormControl, InputLabel, PasswordField } from '@fields';
import { ArrowRightIcon } from '@icons';
import { useAppDispatch, useAppSelector } from '@store';
import { ResetPasswordData, resetPasswordFormSubmit, resetPasswordFormSubmitErrorMessageSelector, resetPasswordFormSubmitStatusSelector } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { renderTextWithBreakLines } from '@utils/render';
import { getProjectName } from '@utils/translate/get-project-name';
import { composeValidators, passwordValidator, required } from '@validators';

import './password-reset.scss';

const t = translateByNamespace('admin:password-reset-page');
const commonT = translateByNamespace('common:validators');
const cn = classname('password-reset-page');

type PasswordResetFormValidationErrors = Partial<Record<keyof ResetPasswordData, string>>;

const BE_VERIFY_CODE_REQUIRED_ERROR = 'The verify code field is required.';
const BE_USED_PASSWORD_ERROR = 'The selected password has already been used in the past and cannot be used again.';
const BE_INVALID_LINK_ERROR = 'Your link is invalid.';

const validatePasswordResetForm = (values: ResetPasswordData): PasswordResetFormValidationErrors | undefined => {
    if (values.newPassword !== values.newPasswordConfirmation) {
        return { newPasswordConfirmation: commonT('passwords-do-not-match') };
    }

    return undefined;
};

const PasswordResetPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const onSubmit = useCallback((data: ResetPasswordData) => dispatch(resetPasswordFormSubmit(data)), [dispatch]);

    const resetPasswordFormSubmitStatus = useAppSelector(resetPasswordFormSubmitStatusSelector);
    const resetPasswordFormSubmitErrorMessage = useAppSelector(resetPasswordFormSubmitErrorMessageSelector);

    const isSuccess = resetPasswordFormSubmitStatus === RequestStatus.SUCCESS;
    const isProcessing = resetPasswordFormSubmitStatus === RequestStatus.PROCESSING;

    const errorBlock = useMemo(() => {
        if (!resetPasswordFormSubmitErrorMessage) {
            return null;
        }

        let errorMessageText = resetPasswordFormSubmitErrorMessage;

        if (resetPasswordFormSubmitErrorMessage.includes(BE_VERIFY_CODE_REQUIRED_ERROR)) {
            errorMessageText = t('verify-code-required-error');
        }

        if (resetPasswordFormSubmitErrorMessage.includes(BE_USED_PASSWORD_ERROR)) {
            errorMessageText = t('used-password-error');
        }

        if (resetPasswordFormSubmitErrorMessage.includes(BE_INVALID_LINK_ERROR)) {
            errorMessageText = t('invalid-link-error');
        }

        return <AlertBlock view='danger'>{errorMessageText}</AlertBlock>;
    }, [resetPasswordFormSubmitErrorMessage]);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('page-title', { projectName: getProjectName() })}</title>
            </Head>
            <h1 className={cn('title')}>{t('title')}</h1>
            <h4 className={cn('description')}>{t('description')}</h4>
            {!isSuccess && (
                <Form<ResetPasswordData>
                    onSubmit={onSubmit}
                    initialValues={{ verifyCode: router.query.code as string }}
                    validate={validatePasswordResetForm}
                    render={({ handleSubmit }) => {
                        return (
                            <form onSubmit={handleSubmit} className={cn('form')}>
                                <FormControl>
                                    <InputLabel required={true}>{t('password-label')}</InputLabel>
                                    <PasswordField
                                        name='newPassword'
                                        placeholder={t('password-placeholder')}
                                        validate={composeValidators(required, passwordValidator())}
                                    />
                                </FormControl>
                                <FormControl>
                                    <InputLabel required={true}>{t('confirm-password-label')}</InputLabel>
                                    <PasswordField
                                        name='newPasswordConfirmation'
                                        placeholder={t('confirm-password-placeholder')}
                                        validate={composeValidators(required, passwordValidator())}
                                    />
                                </FormControl>
                                {errorBlock}
                                <div className={cn('controls-container')}>
                                    <Button className={cn('submit-button')} type='submit' view='primary' disabled={isProcessing}>
                                        {t('submit-button')}
                                    </Button>
                                    <Link className={cn('sign-in-link')} href='/admin/sign-in' as='/admin/sign-in'>
                                        {t('sign-in-link')}
                                    </Link>
                                </div>
                            </form>
                        );
                    }}
                />
            )}
            {isSuccess && (
                <div className={cn('success-block')}>
                    <div className={cn('alert')}>
                        <AlertBlock>{renderTextWithBreakLines(t('success-text'))}</AlertBlock>
                    </div>
                    <Link href='/admin/sign-in' as='/admin/sign-in'>
                        <Button className={cn('sign-in-button')} type='button' view='primary'>
                            {t('sign-in-button')} <ArrowRightIcon />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
};

PasswordResetPage.getLayout = getAdminAuthLayout;

export default PasswordResetPage;
