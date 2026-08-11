import { useMemo } from 'react';

import { UserRoleGroup } from '@/enums/user-role-group';
import { useAppSelector } from '@store';
import { authorizedUserSelector } from '@store/global';

import { useGetCompanyData } from '../companies/use-get-company-data';

export const useIsPartnerCompany = () => {
    const { data: userCompany } = useGetCompanyData();
    const authorizedUser = useAppSelector(authorizedUserSelector);

    return useMemo(() => {
        if (userCompany) {
            return userCompany.isPartner;
        }

        // Admins watch pages as partners
        return authorizedUser?.roleGroup === UserRoleGroup.ADMINISTRATORS;
    }, [authorizedUser, userCompany]);
};
