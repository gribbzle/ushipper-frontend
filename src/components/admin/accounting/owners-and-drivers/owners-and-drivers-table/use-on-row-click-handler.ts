import { useCallback } from 'react';

import { useHandleOpenAccountingDrawerClick } from '@hooks';
import { AccountingAccountData } from '@store/api/accounting-accounts-api';

export const useOnRowClickHandler = () => {
    const onClickHandler = useHandleOpenAccountingDrawerClick();

    const onRowClickHandler = useCallback(
        async (account: AccountingAccountData) => {
            onClickHandler(account.publicId);
        },
        [onClickHandler],
    );

    return onRowClickHandler;
};
