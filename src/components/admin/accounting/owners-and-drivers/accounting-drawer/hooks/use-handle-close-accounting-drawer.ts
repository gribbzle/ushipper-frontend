import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';

export const useHandleCloseAccountingDrawer = () => {
    const dispatch = useAppDispatch();

    const handleCloseDrawer = useCallback(async () => {
        await dispatch(
            accountingActions.setAccountingDrawerProps({
                isDrawerOpened: false,
                accountId: null,
                selectedTab: null,
                isRocketkorFormVisible: false,
                isFinancialFormVisible: false,
            }),
        );
        await dispatch(accountingActions.clearSelectedAccount());
    }, [dispatch]);

    return {
        handleCloseDrawer,
    };
};
