import { useMemo } from 'react';

import { useAppSelector } from '@store';
import { accountingDrawerPropsSelector } from '@store/admin';

import { useGetAccountingProfile } from '../hooks/use-get-accounting-profile';
import { useGetFinancialBalances } from '../hooks/use-get-financial-balances';

export const useFinancialAccounts = () => {
    const { isFinancialFormVisible } = useAppSelector(accountingDrawerPropsSelector);

    const { accountingProfile } = useGetAccountingProfile();
    const { financialBalances, isSuccess, isLoading } = useGetFinancialBalances();

    const isEmptyFinancialAccounts = useMemo(
        () => isSuccess && financialBalances?.length === 0 && accountingProfile && !isFinancialFormVisible,
        [isSuccess, accountingProfile, financialBalances, isFinancialFormVisible],
    );

    const isFinancialAccountsList = useMemo(
        () => isSuccess && !!financialBalances?.length && accountingProfile && !isFinancialFormVisible,
        [isSuccess, accountingProfile, financialBalances, isFinancialFormVisible],
    );

    return {
        isLoading,
        isFinancialFormVisible,
        isEmptyFinancialAccounts,
        isFinancialAccountsList,
        accountingProfile,
        financialBalances,
    };
};
