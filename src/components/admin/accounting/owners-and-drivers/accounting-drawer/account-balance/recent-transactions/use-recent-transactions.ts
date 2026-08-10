import { useMemo } from 'react';

import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { TransactionStatusGroupEnum } from '@/enums/transactions/transaction-status-group-enum';
import { useDefaultAccountBalance } from '@/hooks/accounting/use-default-account-balance';
import { useAppSelector } from '@store';
import { balancesFromSelectedAccountSelector } from '@store/admin';
import { useGetTransactionsQuery } from '@store/api/transactions-api';
import { formatToCurrency } from '@utils/numbers';

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
