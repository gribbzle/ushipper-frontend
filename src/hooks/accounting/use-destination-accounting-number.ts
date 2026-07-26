import { useMemo } from 'react';

import { TransactionBalanceResource } from '@store/admin';

export const useDestinationAccountingNumber = (destination: TransactionBalanceResource | null) => {
    return useMemo(() => {
        if (!destination) return null;

        const { bankAccount, card } = destination;

        return bankAccount?.maskedNumber ?? card?.maskedNumber ?? null;
    }, [destination]);
};
