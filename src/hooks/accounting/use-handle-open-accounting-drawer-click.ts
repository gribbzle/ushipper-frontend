import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { AccountingTab } from '@components';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { translateByNamespace } from '@utils';

const t = translateByNamespace('admin:accounting:notifications');

export const useHandleOpenAccountingDrawerClick = () => {
    const dispatch = useAppDispatch();

    const onOpenAccountingDrawerHandler = useCallback(
        async (accountPublicId?: string | null) => {
            if (accountPublicId) {
                dispatch(
                    accountingActions.setAccountingDrawerProps({
                        isDrawerOpened: true,
                        accountId: accountPublicId,
                        selectedTab: AccountingTab.ACCOUNT_BALANCE,
                    }),
                );
            } else {
                toast.error<string>(t('upload-account-error'));
            }
        },
        [dispatch],
    );

    return onOpenAccountingDrawerHandler;
};
