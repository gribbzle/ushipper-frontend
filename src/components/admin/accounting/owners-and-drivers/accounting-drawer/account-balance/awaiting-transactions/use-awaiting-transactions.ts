import { useMemo } from 'react';

import { OrderSortingDirection, TransactionStatusGroupEnum } from '@/enums';
import { useDefaultAccountBalance } from '@hooks';
import { useAppSelector } from '@store';
import { balancesFromSelectedAccountSelector } from '@store/admin';
import { useGetTransactionsQuery } from '@store/api/transactions-api';
import { calculateAwaitingBalance } from '@utils/calculate-awaiting-balance';

const DEFAULT_PARAMS = {
    perPage: 3,
    orderName: 'created_at',
    orderDirection: OrderSortingDirection.DESC,
};

export const useAwaitingTransactions = () => {
    const balances = useAppSelector(balancesFromSelectedAccountSelector);

    const defaultBalance = useDefaultAccountBalance(balances);

    const { data: transactionsData } = useGetTransactionsQuery(
        { balanceId: defaultBalance?.publicId, statusGroup: TransactionStatusGroupEnum.AWAITING, ...DEFAULT_PARAMS },
        { skip: !defaultBalance?.publicId },
    );

    const subTitle = useMemo(
        () => calculateAwaitingBalance({ withdrawal: defaultBalance?.pendingWithdrawal.amount, deposit: defaultBalance?.pendingDeposit.amount }),
        [defaultBalance],
    );

    const areMoreTransactions = useMemo<boolean>(() => !!transactionsData?.meta?.lastPage && transactionsData.meta.lastPage > 1, [transactionsData]);

    return { transactionsData, areMoreTransactions, subTitle };
};
