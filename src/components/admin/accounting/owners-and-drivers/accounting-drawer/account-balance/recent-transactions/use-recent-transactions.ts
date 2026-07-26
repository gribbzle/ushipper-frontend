import { useMemo } from 'react';

import { OrderSortingDirection, TransactionStatusGroupEnum } from '@/enums';
import { useDefaultAccountBalance } from '@hooks';
import { useAppSelector } from '@store';
import { balancesFromSelectedAccountSelector } from '@store/admin';
import { useGetTransactionsQuery } from '@store/api/transactions-api';
import { formatToCurrency } from '@utils';

const DEFAULT_PARAMS = {
    perPage: 5,
    orderName: 'created_at',
    orderDirection: OrderSortingDirection.DESC,
};

export const useRecentTransactions = () => {
    const balances = useAppSelector(balancesFromSelectedAccountSelector);
    const defaultBalance = useDefaultAccountBalance(balances);

    const { data: transactionsData } = useGetTransactionsQuery(
        { balanceId: defaultBalance?.publicId, statusGroup: TransactionStatusGroupEnum.COMPLETED, ...DEFAULT_PARAMS },
        { skip: !defaultBalance?.publicId },
    );

    const title = useMemo(() => defaultBalance?.displayedBalance.formatted ?? formatToCurrency(0), [defaultBalance]);

    const areMoreTransactions = useMemo<boolean>(() => !!transactionsData?.meta?.lastPage && transactionsData.meta.lastPage > 1, [transactionsData]);

    return { title, transactionsData, areMoreTransactions };
};
