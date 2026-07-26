import { useAppDispatch, useAppSelector } from '@store';
import { accountingDrawerPropsSelector } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';

export const useInvalidateSelectedAccountTags = () => {
    const { accountId } = useAppSelector(accountingDrawerPropsSelector);
    const dispatch = useAppDispatch();

    const invalidateSelectedAccountTags = () => {
        if (accountId) {
            dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: accountId }]));
        }
    };

    return invalidateSelectedAccountTags;
};
