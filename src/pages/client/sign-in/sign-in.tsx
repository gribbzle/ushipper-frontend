import React from 'react';

import { SignInForm } from '@/components/client/sign-in/sign-in-form/sign-in-form';
import { SignUpBlock } from '@/components/client/sign-in/sign-up-block/sign-up-block';
import { getProductInfoLayout } from '@/components/common/product-info-layout/product-info-layout';
import { UserRoleGroup } from '@/enums/user-role-group';
import { UserRoleType } from '@/enums/user-role-type';
import { wrapper } from '@/store';
import { authorizedUserSelector } from '@/store/global/selectors';
import { classname } from '@/utils/classname';

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
