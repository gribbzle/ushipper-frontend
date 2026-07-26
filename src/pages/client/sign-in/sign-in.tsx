import React from 'react';

import { UserRoleGroup, UserRoleType } from '@/enums';
import { getProductInfoLayout, SignInForm, SignUpBlock } from '@components';
import { wrapper } from '@store';
import { authorizedUserSelector } from '@store/global';
import { classname } from '@utils';

import './sign-in.scss';

export const getServerSideProps = wrapper.getServerSideProps(store => async () => {
    const authoziredUser = authorizedUserSelector(store.getState());

    if (authoziredUser && [UserRoleType.DISPATCHER_OWNER, UserRoleType.DRIVER_OWNER].includes(authoziredUser.roleType)) {
        return {
            redirect: {
                destination: '/client/dashboard',
                permanent: false,
            },
        };
    } else if (authoziredUser && authoziredUser.roleGroup !== UserRoleGroup.ADMINISTRATORS) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return { props: {} };
});

const cn = classname('sign-in-page');

const SignInPage = () => (
    <div className={cn()}>
        <SignInForm />
        <SignUpBlock />
    </div>
);

SignInPage.getLayout = getProductInfoLayout;

export default SignInPage;
