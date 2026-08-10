import React, { useEffect, useMemo } from 'react';

import { useMeDriverRelated } from '@/hooks/use-user-role-group';
import { useAppDispatch, useAppSelector } from '@store';
import { useGetAccountQuery } from '@store/api/accounts-api';
import { accountsActions, accountsUsersSelector } from '@store/client/accounts';
import { authorizedUserAccountPublicIdSelector } from '@store/global';
import { classname } from '@utils/classname';

import { AccountChangeForm } from '../account-change-form';

import { useRoutes } from './hooks/use-routes';
import { SidebarRoute } from './sidebar-route/sidebar-route';
import { Logo } from './logo';

import './sidebar.scss';

const cn = classname('main-layout-sidebar');

export const Sidebar = () => {
    const dispatch = useAppDispatch();
    const isDriver = useMeDriverRelated();
    const accountPublicId = useAppSelector(authorizedUserAccountPublicIdSelector) as string;
    const fetchedAccounts = useAppSelector(accountsUsersSelector);

    const { data: account } = useGetAccountQuery(accountPublicId, { skip: !accountPublicId });

    useEffect(() => {
        if (account) {
            dispatch(accountsActions.setAccounts(account));
        }
    }, [dispatch, account]);

    const routes = useRoutes();

    const showAccountChangeForm = useMemo(() => !isDriver && fetchedAccounts && fetchedAccounts.length > 1, [isDriver, fetchedAccounts]);

    return (
        <div className={cn()}>
            <Logo />
            {showAccountChangeForm && <AccountChangeForm />}
            <div className={cn('routes-wrapper')}>
                {routes.map(route => (
                    <SidebarRoute key={route.name} route={route} />
                ))}
            </div>
        </div>
    );
};
