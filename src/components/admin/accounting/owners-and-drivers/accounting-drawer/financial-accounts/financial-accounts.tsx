import React from 'react';

import { Loader } from '@/components/common/loader/loader';

import { EmptyBalanceBlock } from '../common';

import { FinancialAccountForm } from './financial-account-form/financial-account-form';
import { EmptyFinancialAccounts } from './empty-financial-accounts';
import { FinancialAccountsList } from './financial-accounts-list';
import { useFinancialAccounts } from './use-financial-accounts';

export const FinancialAccounts = () => {
    const { isLoading, isFinancialFormVisible, isEmptyFinancialAccounts, isFinancialAccountsList, accountingProfile, financialBalances } =
        useFinancialAccounts();

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            {!accountingProfile && <EmptyBalanceBlock />}
            {isEmptyFinancialAccounts && <EmptyFinancialAccounts />}
            {isFinancialAccountsList && <FinancialAccountsList balances={financialBalances} />}
            {isFinancialFormVisible && <FinancialAccountForm />}
        </>
    );
};
