import { useAppSelector } from '@store';
import { accountingDrawerPropsSelector, selectedAccountSelector } from '@store/admin';
import { useGetAccountingProfileQuery } from '@store/api/accounts-api';

export const useGetAccountingProfile = () => {
    const { accountId } = useAppSelector(accountingDrawerPropsSelector);
    const account = useAppSelector(selectedAccountSelector);

    const { data, isLoading } = useGetAccountingProfileQuery(accountId || '', { skip: !accountId });

    return {
        account,
        accountingProfile: data,
        isLoading,
    };
};
