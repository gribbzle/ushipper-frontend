import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Form } from 'react-final-form';

import { AccountInfo } from '@/components/client/sign-up/account-info';
import { AccountType } from '@/components/client/sign-up/account-type';
import { BusinessDetails } from '@/components/client/sign-up/business-details';
import { Completed } from '@/components/client/sign-up/completed';
import { Invitation } from '@/components/client/sign-up/invitation';
import { Sidebar } from '@/components/client/sign-up/sidebar';
import { UsdotVerification } from '@/components/client/sign-up/usdot-verification';
import { prepareSignUpPayload } from '@/components/client/sign-up/utils';
import { CompanyType } from '@/enums/company-type';
import { RegistrationType } from '@/enums/registration-type';
import { SignUpStep } from '@/enums/sign-up-step';
import { UserRoleType } from '@/enums/user-role-type';
import { Button } from '@/components/common/button/button';
import { GoToSignInButton } from '@/components/common/go-to-sign-in-button';
import { Link } from '@/components/common/link/link';
import { useEffectOnce } from '@/hooks/use-effect-once';
import ArrowLeftIcon from '@/assets/icons/arrow-left.svg';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import { useAppDispatch, useAppSelector } from '@/store';
import { useGetInvitationActionQuery } from '@store/api/invite-api';
import {
    acceptInvitationSubmit,
    confirmationMethodsSelector,
    fetchSignUpConfigAction,
    requestUSDOTVerifyFormSubmit,
    SignUpFormState,
    signUpFormSubmit,
    signUpFormSubmitStatusSelector,
} from '@store/client';
import { classname } from '@utils/classname';
import { getErrors } from '@utils/form';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { getProjectName } from '@utils/translate/get-project-name';

import './sign-up.scss';

const t = translateByNamespace('client:sign-up-page');
const cn = classname('sign-up-page');

const DEFAULT_STEPS = [SignUpStep.ACCOUNT_TYPE, SignUpStep.ACCOUNT_INFO, SignUpStep.FORM_COMPETED];
const DISPATCHER_STEPS = [SignUpStep.ACCOUNT_TYPE, SignUpStep.ACCOUNT_INFO, SignUpStep.BUSINESS_DETAILS, SignUpStep.FORM_COMPETED];
const INVITATION_STEPS = [SignUpStep.INVITATION, SignUpStep.ACCOUNT_INFO, SignUpStep.BUSINESS_DETAILS, SignUpStep.FORM_COMPETED];
const CARRIER_STEPS = [SignUpStep.ACCOUNT_TYPE, SignUpStep.ACCOUNT_INFO, SignUpStep.USDOT_VERIFICATION, SignUpStep.FORM_COMPETED];

const SignUpPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const [steps, setSteps] = useState([...DEFAULT_STEPS]);
    const [companyType, setCompanyType] = useState(CompanyType.CARRIER);
    const [currentStep, setCurrentStep] = useState(SignUpStep.ACCOUNT_TYPE);

    const signUpFormSubmitStatus = useAppSelector(signUpFormSubmitStatusSelector);
    const confirmationMethods = useAppSelector(confirmationMethodsSelector);

    const isUSDOTRegistrationRequired = confirmationMethods?.[companyType] === RegistrationType.USDOT_CONFIRMATION;
    const { query } = router;

    const { data: invitation } = useGetInvitationActionQuery(String(query.code), {
        skip: !query.code,
    });

    useEffectOnce(() => {
        dispatch(fetchSignUpConfigAction());
    }, []);

    useEffect(() => {
        if (!invitation) {
            return;
        }

        setSteps([...INVITATION_STEPS]);
        setCurrentStep(SignUpStep.INVITATION);

        const roleMapping: Partial<Record<UserRoleType, CompanyType>> = {
            [UserRoleType.CARRIER_DISPATCHER]: CompanyType.DISPATCHER,
            [UserRoleType.CARRIER_DRIVER]: CompanyType.DRIVER,
        };

        const companyType = roleMapping[invitation.payload?.roleType];

        if (companyType) {
            setCompanyType(companyType);
        }
    }, [invitation]);

    useEffect(() => {
        if ([CompanyType.CARRIER].includes(companyType) && isUSDOTRegistrationRequired) {
            return setSteps([...CARRIER_STEPS]);
        }

        if ([CompanyType.DISPATCHER, CompanyType.DRIVER].includes(companyType)) {
            return setSteps([...DISPATCHER_STEPS]);
        }

        setSteps([...DEFAULT_STEPS]);
    }, [isUSDOTRegistrationRequired, companyType]);

    useEffect(() => {
        if (signUpFormSubmitStatus === RequestStatus.SUCCESS) {
            setCurrentStep(SignUpStep.FORM_COMPETED);
        }
    }, [signUpFormSubmitStatus]);

    const getStepIndex = useCallback((name: SignUpStep) => steps.indexOf(name), [steps]);

    const handleLoginUserCodeInvitation = useCallback(async () => {
        await dispatch(acceptInvitationSubmit(String(invitation?.payload.code)));
        await router.push('/client/orders', '/orders');
    }, [dispatch, invitation, router]);

    const handleNextStep = useCallback(
        async (values: SignUpFormState) => {
            if (currentStep === SignUpStep.INVITATION && invitation?.action === 'login_user_code') {
                handleLoginUserCodeInvitation();

                return;
            }

            if (isUSDOTRegistrationRequired && currentStep === SignUpStep.USDOT_VERIFICATION) {
                const result = await dispatch(requestUSDOTVerifyFormSubmit({ usDotNumber: values.usdotNumber as string }));

                if (result.payload !== '') {
                    return getErrors(result);
                }
            }

            if (currentStep === SignUpStep.BUSINESS_DETAILS || currentStep === steps[getStepIndex(SignUpStep.FORM_COMPETED) - 1]) {
                const payload = prepareSignUpPayload(values);

                if (invitation) {
                    payload.invitationCode = invitation.payload.invitationCode;
                }

                const result = await dispatch(signUpFormSubmit(payload));
                const errors = getErrors(result);
                const isUSDotError = Object.keys(errors).length === 1 && 'usdotNumber' in errors;

                if (Object.keys(errors).length > 0 && !isUSDotError) {
                    if ('email' in errors) {
                        setCurrentStep(SignUpStep.ACCOUNT_INFO);
                    }

                    return errors;
                }
            }

            setCurrentStep(steps[getStepIndex(currentStep) + 1]);
        },
        [currentStep, invitation, isUSDOTRegistrationRequired, steps, getStepIndex, handleLoginUserCodeInvitation, dispatch],
    );

    const handleChangeCompanyType = useCallback((value: CompanyType) => setCompanyType(value), []);

    const handleBackStep = useCallback(() => setCurrentStep(steps[getStepIndex(currentStep) - 1]), [currentStep, getStepIndex, steps]);

    return (
        <div className={cn()}>
            <Head>
                <title>{t('title', { projectName: getProjectName() })}</title>
            </Head>
            <Sidebar steps={steps} currentStep={currentStep} getStepIndex={name => getStepIndex(name)} />
            <div className={cn('form')}>
                <Form<SignUpFormState>
                    initialValues={{
                        companyName: invitation?.company.name ?? undefined,
                        companyType,
                        email: invitation?.payload?.email ?? undefined,
                    }}
                    onSubmit={handleNextStep}
                    subscription={{ values: true }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            {currentStep === SignUpStep.INVITATION && invitation && <Invitation invitation={invitation} />}
                            {currentStep === SignUpStep.ACCOUNT_TYPE && <AccountType onInputChange={handleChangeCompanyType} />}
                            {currentStep === SignUpStep.ACCOUNT_INFO && (
                                <AccountInfo showCompanyNameField={![CompanyType.DISPATCHER, CompanyType.DRIVER].includes(companyType)} />
                            )}
                            {currentStep === SignUpStep.BUSINESS_DETAILS && <BusinessDetails />}
                            {currentStep === SignUpStep.USDOT_VERIFICATION && <UsdotVerification />}
                            {currentStep === SignUpStep.FORM_COMPETED && confirmationMethods && (
                                <Completed confirmationMethod={confirmationMethods[companyType]} isInvite={Boolean(invitation)} />
                            )}
                            <div
                                className={cn('form-buttons-container', {
                                    center: [SignUpStep.ACCOUNT_TYPE, SignUpStep.INVITATION].includes(currentStep),
                                })}
                            >
                                {![SignUpStep.ACCOUNT_TYPE, SignUpStep.FORM_COMPETED, SignUpStep.INVITATION].includes(currentStep) && (
                                    <Button type='button' view='default' onClick={handleBackStep}>
                                        <ArrowLeftIcon style={{ marginRight: '6px' }} />
                                        {t('form.previous-button')}
                                    </Button>
                                )}
                                {currentStep !== SignUpStep.FORM_COMPETED && (
                                    <Button type='submit' view='primary'>
                                        {currentStep === SignUpStep.INVITATION ? t('form.accept-button') : t('form.continue-button')}
                                        <ArrowRightIcon style={{ marginLeft: '6px' }} />
                                    </Button>
                                )}
                                {currentStep === SignUpStep.FORM_COMPETED && <GoToSignInButton />}
                            </div>
                        </form>
                    )}
                />
                {currentStep === SignUpStep.ACCOUNT_TYPE && (
                    <div className={cn('sign-in-link')}>
                        {t('form.sign-in-text')}{' '}
                        <Link href='/client/sign-in' as='/sign-in'>
                            {t('form.sign-in-link')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUpPage;
