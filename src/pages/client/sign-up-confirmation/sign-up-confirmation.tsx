import React from 'react';
import Head from 'next/head';
import { useSelector } from 'react-redux';

import { signUpConfirm } from '@api';
import { AlertBlock, Button, getProductInfoLayout, GoToSignInButton, Link } from '@components';
import { wrapper } from '@store';
import { signUpConfirmationStatusSelector } from '@store/client';
import { signUpActions } from '@store/client/sign-up/slice';
import { axios } from '@utils/axios';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';
import { renderTextWithBreakLines } from '@utils/render';
import { getProjectName } from '@utils/translate/get-project-name';

import './sign-up-confirmation.scss';

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query }) => {
    const { dispatch } = store;

    try {
        await signUpConfirm(query.code as string);
        dispatch(signUpActions.setSignUpConfirmationInfo({ status: RequestStatus.SUCCESS, code: 200 }));
    } catch (error) {
        dispatch(
            signUpActions.setSignUpConfirmationInfo({ status: RequestStatus.ERROR, code: axios.isAxiosError(error) ? error.response?.status ?? null : 500 }),
        );
    }

    return { props: {} };
});

const t = translateByNamespace('client:sign-up-confirmation-page');
const cn = classname('sign-up-confirmation-page');

const SignUpConfirmationPage = () => {
    const signUpConfirmationStatus = useSelector(signUpConfirmationStatusSelector);

    return (
        <div className={cn()}>
            <Head>
                <title>{`Sign Up | ${getProjectName()}`}</title>
            </Head>

            {signUpConfirmationStatus === RequestStatus.SUCCESS && (
                <>
                    <h1>{t('success-title')}</h1>
                    <h4>
                        {t('description')} <Link href='/'>{t('help-page')}</Link>.
                    </h4>
                    <GoToSignInButton />
                </>
            )}

            {signUpConfirmationStatus === RequestStatus.ERROR && (
                <>
                    <h1>{t('error-title')}</h1>
                    <h4>
                        {t('description')} <Link href='/'>{t('help-page')}</Link>.
                    </h4>
                    <AlertBlock view='warning'>{renderTextWithBreakLines(t('error-description'))}</AlertBlock>
                    <Link href='/'>
                        <Button type='button' view='primary'>
                            {t('contact-support-button')}
                        </Button>
                    </Link>
                </>
            )}
        </div>
    );
};

SignUpConfirmationPage.getLayout = getProductInfoLayout;

export default SignUpConfirmationPage;
