import { useMemo } from 'react';

import { useAppSelector } from '@store';
import { accountUsersSelector } from '@store/global';

export const useHasPartnerCompanies = () => {
    const fetchedAccounts = useAppSelector(accountUsersSelector);

    const hasPartnerCompanies = useMemo(() => fetchedAccounts?.some(account => account.company && account.company.isPartner), [fetchedAccounts]);

    return { hasPartnerCompanies, fetchedAccounts };
};
