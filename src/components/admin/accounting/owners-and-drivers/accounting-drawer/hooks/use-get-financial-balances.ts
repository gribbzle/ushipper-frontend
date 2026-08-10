import { useMemo, useState } from 'react';

import { BalanceType } from '@/enums/balance-type';
import { useAppSelector } from '@store';
import { accountingDrawerPropsSelector } from '@store/admin';
import { useGetBalancesQuery } from '@store/api/balances-api';

export const useGetFinancialBalances = () => {
    const { accountId } = useAppSelector(accountingDrawerPropsSelector);
    const [cursor, setCursor] = useState<string | undefined>();

    const {
        data: financialBalancesData,
        isSuccess,
        isLoading,
    } = useGetBalancesQuery({ accountId: accountId || '', cursor, orderName: 'created_at', orderDirection: 'desc' }, { skip: !accountId });

    const financialBalances = useMemo(
        () => (financialBalancesData ? financialBalancesData?.data.filter(item => item.type !== BalanceType.INTERNAL_USER_WALLET) : []),
        [financialBalancesData],
    );

    return {
        financialBalances,
        isSuccess,
        isLoading,
        cursor,
        setCursor,
    };
};
