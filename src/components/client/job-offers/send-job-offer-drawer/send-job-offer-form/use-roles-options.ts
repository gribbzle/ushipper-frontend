import { useMemo } from 'react';

import { UserRoleType } from '@/enums';
import { useMeDispatcher, useMeDriver } from '@hooks';
import { useAppSelector } from '@store';
import { useGetRolesQuery } from '@store/api/roles-api';
import { UserRole } from '@store/common';
import { authorizedUserCompanyPublicIdSelector } from '@store/global';

export const useRolesOptions = (valueField: keyof UserRole = 'type', type?: UserRoleType, selectedCompanyId?: string) => {
    const companyId = useAppSelector(authorizedUserCompanyPublicIdSelector);
    const isMeDispatcher = useMeDispatcher();
    const isMeDriver = useMeDriver();
    const { data: userRoles } = useGetRolesQuery(
        { companyId: selectedCompanyId ?? companyId, type: type ?? UserRoleType.CARRIER_DISPATCHER },
        { skip: isMeDispatcher || isMeDriver },
    );

    return useMemo(() => userRoles?.map(userRole => ({ value: userRole[valueField], label: userRole.name })), [userRoles, valueField]);
};
