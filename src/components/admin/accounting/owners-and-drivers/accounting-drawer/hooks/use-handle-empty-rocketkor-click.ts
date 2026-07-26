import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';

import { AccountingTab } from '../accounting-drawer-tabs';

export const useHandleEmptyRocketkorClick = () => {
    const dispatch = useAppDispatch();

    const handleEmptyRocketkorClick = useCallback(
        () =>
            dispatch(
                accountingActions.setAccountingDrawerProps({
                    selectedTab: AccountingTab.ROCKETKOR,
                    isRocketkorFormVisible: true,
                }),
            ),
        [dispatch],
    );

    return { handleEmptyRocketkorClick };
};
