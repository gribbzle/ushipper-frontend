import { useMemo } from 'react';

import { CompanyType } from '@/enums';
import { useAppSelector } from '@store';
import { selectedAccountSelector } from '@store/admin';
import { AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { AccountUser } from '@store/client/accounts';

export const useCustomFeesBlock = () => {
    const account = useAppSelector(selectedAccountSelector);

    const companyNamesArray = useMemo(() => {
        const users = account?.users as (AccountingAccountUserData | AccountUser)[];

        return users?.filter(({ company }) => company && company.type !== CompanyType.DRIVER).map(({ company }) => company!.name) || [];
    }, [account]);

    return { companyNamesArray };
};
