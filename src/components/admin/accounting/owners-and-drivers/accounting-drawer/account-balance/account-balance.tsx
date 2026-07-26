import React from 'react';

import { Loader } from '@/components/common';
import { classname } from '@utils';

import { EmptyBalanceBlock } from '../common';
import { useGetAccountingProfile } from '../hooks';

import { AwaitingTransactions } from './awaiting-transactions';
import { PendingOrders } from './pending-orders';
import { RecentTransactions } from './recent-transactions';

import './account-balance.scss';

const cn = classname('account-balance');

export const AccountBalance = () => {
    const { accountingProfile, isLoading } = useGetAccountingProfile();

    if (isLoading) {
        return <Loader />;
    }

    return accountingProfile ? (
        <div className={cn('')}>
            <RecentTransactions />
            <AwaitingTransactions />
            <PendingOrders />
        </div>
    ) : (
        <EmptyBalanceBlock />
    );
};
