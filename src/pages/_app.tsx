import React, { useEffect } from 'react';
import { ReactElement, ReactNode } from 'react';
import { FastifyRequest } from 'fastify';
import i18next from 'i18next';
import { NextPage } from 'next';
import { AppProps, default as NextApp } from 'next/app';
import dynamic from 'next/dynamic';
import { MapProvider } from 'react-map-gl/mapbox';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { setupListeners } from '@reduxjs/toolkit/query';

import RouterProvider from '@/components/common/router-provider/router-provider';
import {
    fetchedAccountUserToken,
    fetchedAuthorizedAccount,
    fetchedAuthorizedUser,
    fetchedDriverPaymentRequestCounter,
    fetchedIssuesCounter,
    fetchedUserPermissions,
} from '@api';
import { wrapper } from '@store';
import { AccountToken } from '@store/client';
import { AccountData, AccountUser } from '@store/client/accounts';
import { globalActions } from '@store/global';
import { AuthorizedUserInfo, Permissions } from '@store/global/types';

import './globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import 'react-photo-view/dist/react-photo-view.css';

import '../i18n';
import '../pdf-worker';

const CallingPopup = dynamic(() => import('../components/client/loadboard/calling-popup/calling-popup').then(exports => exports.CallingPopup), { ssr: false });
const IncomingCalling = dynamic(() => import('../components/common/incoming-calling/incoming-calling').then(exports => exports.IncomingCalling), {
    ssr: false,
});

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

type InitialData = {
    user: AuthorizedUserInfo;
    fetchUserStatus: number;
    permissions: Permissions;
    fetchPermissionsStatus: number;
    account: AccountData;
    accountUser: AccountUser;
    token: string;
    accountTokens: AccountToken[];
    driverPaymentRequestsCounterStatus: number | null;
    driverPaymentRequestsCounter: number;
    issuesCounter: number | null;
    issuesCounterStatus: number;
};

type GlobalActions = typeof globalActions;

const actionMap: { [K in keyof InitialData]: (typeof globalActions)[keyof GlobalActions] } = {
    user: globalActions.setUser,
    fetchUserStatus: globalActions.setFetchUserStatus,
    permissions: globalActions.setPermissions,
    fetchPermissionsStatus: globalActions.setFetchPermissionsStatus,
    token: globalActions.setToken,
    account: globalActions.setAccount,
    accountUser: globalActions.setAccountUser,
    accountTokens: globalActions.setAccountTokens,
    driverPaymentRequestsCounterStatus: globalActions.setDriverPaymentRequestsCounterStatus,
    driverPaymentRequestsCounter: globalActions.setDriverPaymentRequestsCounter,
    issuesCounter: globalActions.setIssuesCounter,
    issuesCounterStatus: globalActions.setIssuesCounterStatus,
};

const App = ({ Component, ...rest }: AppPropsWithLayout) => {
    const getLayout = Component.getLayout ?? ((page: ReactElement) => page);
    const { store, props } = wrapper.useWrappedStore(rest);

    useEffect(() => setupListeners(store.dispatch), [store]);

    return (
        <Provider store={store}>
            <RouterProvider>
                <MapProvider>{getLayout(<Component {...props.pageProps} />)}</MapProvider>
            </RouterProvider>
            <ToastContainer
                position='top-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={true}
                pauseOnHover={true}
                theme='light'
            />
            <CallingPopup />
            <IncomingCalling />
        </Provider>
    );
};

App.getInitialProps = wrapper.getInitialAppProps(store => async appContext => {
    const appProps = { pageProps: await NextApp.getInitialProps(appContext) };
    const req = appContext.ctx.req as FastifyRequest | undefined;

    if (!req) {
        return appProps;
    }

    const authorization = req.cookies.Authorization;
    const publicUserId = req.cookies.PublicUserId;
    const publicAccountId = req.cookies.PublicAccountId;

    const initialData: Partial<InitialData> = {};

    if (authorization && publicAccountId && publicUserId) {
        initialData.token = authorization;

        const { user, status, error } = await fetchedAuthorizedUser(authorization, publicUserId);

        if (error) {
            initialData.fetchUserStatus = status;
        } else {
            initialData.user = user;
            initialData.fetchUserStatus = status;

            if (user?.roleId) {
                const { permissions, status, error } = await fetchedUserPermissions(authorization, user.roleId);

                if (error) {
                    initialData.fetchPermissionsStatus = status;
                } else {
                    initialData.permissions = permissions;
                    initialData.fetchPermissionsStatus = status;
                }
            }

            if (user?.roleGroup === 'administrators') {
                const {
                    count: paymentRequestsCounter,
                    status: paymentRequestsStatus,
                    error: paymentRequestsError,
                } = await fetchedDriverPaymentRequestCounter(authorization);

                initialData.driverPaymentRequestsCounter = paymentRequestsError ? null : paymentRequestsCounter;
                initialData.driverPaymentRequestsCounterStatus = paymentRequestsStatus;

                const { pending: issuesCounter, status: issuesCounterStatus, error: alertsCounterError } = await fetchedIssuesCounter(authorization);

                initialData.issuesCounterStatus = issuesCounterStatus;
                initialData.issuesCounter = alertsCounterError ? null : issuesCounter;
            }
        }

        const { account, error: accountError } = await fetchedAuthorizedAccount(authorization, publicAccountId);

        if (!accountError && account) {
            initialData.account = account;

            const currentUser = account.users.find(accountUser => accountUser.publicId === publicUserId);
            const tokens: AccountToken[] = [];

            if (currentUser) {
                tokens.push({
                    token: authorization,
                    userId: currentUser.publicId,
                    companyId: currentUser.company?.publicId ?? '',
                });

                initialData.accountUser = currentUser;
            }
            const accountUsers = account.users.filter(accountUser => accountUser.publicId !== publicUserId);

            for (const accountUser of accountUsers) {
                const { token, error } = await fetchedAccountUserToken(
                    {
                        grantType: 'switch_user',
                        userPublicId: accountUser.publicId,
                    },
                    authorization,
                );

                if (token && !error) {
                    tokens.push({
                        token: `Bearer ${token.token}`,
                        userId: accountUser.publicId,
                        companyId: accountUser.company?.publicId ?? '',
                    });
                }
            }
            initialData.accountTokens = tokens;
        }
    } else {
        initialData.fetchUserStatus = 401;
    }

    Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
            const action = actionMap[key as keyof InitialData];

            if (action) {
                store.dispatch(action(value));
            }
        }
    });

    if (req.cookies.language) {
        await i18next.changeLanguage(req.cookies.language);
    }

    return appProps;
});

export default App;
