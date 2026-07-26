import { useMemo } from 'react';

import { UserRoleGroup } from '@/enums';
import { useAppSelector } from '@store';
import { authorizedUserSelector } from '@store/global';

import { useGetCompanyData } from '../companies';

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
