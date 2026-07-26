import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';

export const useEmptyFinancialAccounts = () => {
    const dispatch = useAppDispatch();

    const handleEmptyFinancialAccountsClick = useCallback(
        () =>
            dispatch(
                accountingActions.setAccountingDrawerProps({
                    isFinancialFormVisible: true,
                }),
            ),
        [dispatch],
    );

    return { handleEmptyFinancialAccountsClick };
};
