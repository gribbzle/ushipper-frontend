import React, { useCallback, useEffect, useRef } from 'react';
import { FormApi } from 'final-form';
import { Field, Form } from 'react-final-form';

import { AlertBlock, AuthPageHeader, ControlsActions, getProductInfoLayout, GoToSignInButton, SignUpBlock } from '@components';
import { StringInput } from '@fields';
import { useAppDispatch, useAppSelector } from '@store';
import { requestResetFormErrorSelector, requestResetFormSubmit, requestResetFormSubmitStatusSelector, RequestResetPasswordData } from '@store/common';
import { classname, getProjectName, renderTextWithBreakLines, RequestStatus, translateByNamespace } from '@utils';
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
