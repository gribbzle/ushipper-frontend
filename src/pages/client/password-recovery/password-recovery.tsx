import React, { useCallback, useEffect, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { AuthPageHeader } from '@/components/common/auth-page-header/auth-page-header';
import { ControlsActions } from '@/components/client/password-recovery/controls-actions/controls-actions';
import { getProductInfoLayout } from '@/components/common/product-info-layout/product-info-layout';
import { GoToSignInButton } from '@/components/common/go-to-sign-in-button/go-to-sign-in-button';
import { SignUpBlock } from '@/components/client/sign-in/sign-up-block/sign-up-block';
import { StringInput } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { requestResetFormErrorSelector, requestResetFormSubmit, requestResetFormSubmitStatusSelector, RequestResetPasswordData } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { renderTextWithBreakLines } from '@utils/render';
import { getProjectName } from '@utils/translate/get-project-name';
import { composeValidators, emailValidator, required } from '@validators';

import './password-recovery.scss';

const t = translateByNamespace('client:password-recovery-page');
const cn = classname('password-recovery-page');

const PasswordRecoveryPage = () => {
    const dispatch = useAppDispatch();
    const formRef = useRef<FormApi<RequestResetPasswordData>>();

    const onSubmit = useCallback((data: RequestResetPasswordData) => dispatch(requestResetFormSubmit(data)), [dispatch]);

    const requestResetFormSubmitStatus = useAppSelector(requestResetFormSubmitStatusSelector);
    const requestResetFormError = useAppSelector(requestResetFormErrorSelector);

    useEffect(() => {
        if (requestResetFormError) {
            formRef.current?.blur('email');
        }
    }, [requestResetFormError]);

    const emailFoundValidator = useCallback((dirtySinceLastSubmit: boolean) => () => !dirtySinceLastSubmit && requestResetFormError, [requestResetFormError]);

    return (
        <div className={cn()}>
            <div className={cn('content')}>
                <AuthPageHeader head={t('head', { projectName: getProjectName() })} title={t('title')} />
                {requestResetFormSubmitStatus !== RequestStatus.SUCCESS && (
                    <>
                        <AlertBlock>{renderTextWithBreakLines(t('tip'))}</AlertBlock>
                        <Form<RequestResetPasswordData>
                            onSubmit={onSubmit}
                            validateOnBlur={true}
                            render={({ handleSubmit, form, dirtyFieldsSinceLastSubmit }) => {
                                formRef.current = form;

                                return (
                                    <form onSubmit={handleSubmit}>
                                        <Field
                                            name='email'
                                            label={t('email-label')}
                                            component={StringInput}
                                            placeholder={t('email-placeholder')}
                                            validate={composeValidators(required, emailValidator, emailFoundValidator(dirtyFieldsSinceLastSubmit.email))}
                                            required={true}
                                        />
                                        <ControlsActions
                                            isDisabledSubmitButton={requestResetFormSubmitStatus === RequestStatus.PROCESSING}
                                            buttonLabel={t('submit-button')}
                                        />
                                    </form>
                                );
                            }}
                        />
                    </>
                )}
                {requestResetFormSubmitStatus === RequestStatus.SUCCESS && (
                    <>
                        <AlertBlock>{renderTextWithBreakLines(t('success-text'))}</AlertBlock>
                        <GoToSignInButton />
                    </>
                )}
            </div>

            <SignUpBlock />
        </div>
    );
};

PasswordRecoveryPage.getLayout = getProductInfoLayout;

export default PasswordRecoveryPage;
