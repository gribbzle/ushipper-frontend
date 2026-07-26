import { useMemo } from 'react';

import { BalanceResource } from '@store/admin';

export const useDefaultAccountBalance = (balances: BalanceResource[]) => {
    const defaultBalance = useMemo(() => balances.find(balance => balance.isDefault), [balances]);

    return defaultBalance;
};
