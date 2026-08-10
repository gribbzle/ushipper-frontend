import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Form } from 'react-final-form';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { AuthPageHeader } from '@/components/common/auth-page-header/auth-page-header';
import { ControlsActions } from '@/components/client/password-recovery/controls-actions/controls-actions';
import { getProductInfoLayout } from '@/components/common/product-info-layout/product-info-layout';
import { GoToSignInButton } from '@/components/common/go-to-sign-in-button/go-to-sign-in-button';
import { SignUpBlock } from '@/components/client/sign-in/sign-up-block/sign-up-block';
import {FormControl} from '@/fields/form-control';
import {InputLabel} from '@/fields/input-label';
import {PasswordField} from '@/fields/password-field';
import { useAppDispatch, useAppSelector } from '@store';
import { ResetPasswordData, resetPasswordFormSubmit, resetPasswordFormSubmitErrorMessageSelector, resetPasswordFormSubmitStatusSelector } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { renderTextWithBreakLines } from '@utils/render';
import { getProjectName } from '@utils/translate/get-project-name';
import { composeValidators, passwordValidator, required } from '@validators';

import './password-reset.scss';

const BE_VERIFY_CODE_REQUIRED_ERROR = 'The verify code field is required.';
const BE_USED_PASSWORD_ERROR = 'The selected password has already been used in the past and cannot be used again.';
const BE_INVALID_LINK_ERROR = 'Your link is invalid.';

const t = translateByNamespace('client:password-reset-page');
const cn = classname('password-reset-page');

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
            <div className={cn('content')}>
                <AuthPageHeader head={t('head', { projectName: getProjectName() })} title={t('title')} />
                {!isSuccess && (
                    <Form<ResetPasswordData>
                        onSubmit={onSubmit}
                        initialValues={{ verifyCode: router.query.code as string }}
                        validate={values => {
                            const errors: Record<string, string> = {};

                            if (values.newPassword !== values.newPasswordConfirmation) {
                                errors.newPasswordConfirmation = t('passwords-do-not-match-error');
                            }

                            return errors;
                        }}
                        render={({ handleSubmit }) => {
                            return (
                                <form onSubmit={handleSubmit}>
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
                                    <ControlsActions buttonLabel={t('submit-button')} isDisabledSubmitButton={isProcessing} />
                                </form>
                            );
                        }}
                    />
                )}
                {isSuccess && (
                    <>
                        <div className={cn('success-alert-container')}>
                            <AlertBlock>{renderTextWithBreakLines(t('success-text'))}</AlertBlock>
                        </div>
                        <GoToSignInButton />
                    </>
                )}
            </div>
            <SignUpBlock />
        </div>
    );
};

PasswordResetPage.getLayout = getProductInfoLayout;

export default PasswordResetPage;
