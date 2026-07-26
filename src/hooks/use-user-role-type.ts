import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { AppState } from '@store';

export const authorizedUserRoleTypeSelector = (state: AppState) => state.global.user?.roleType;

export const useRoleCheck = (rolePart: string) => {
    const roleType = useSelector(authorizedUserRoleTypeSelector);

    return useMemo(() => {
        return roleType ? roleType.includes(rolePart) : false;
    }, [roleType, rolePart]);
};

export const useMeOwner = () => useRoleCheck('owner');

export const useMeCarrierDriver = () => useRoleCheck('carrier_driver');

export const useMeCarrierDispatcher = () => useRoleCheck('carrier_dispatcher');

export const useMeCarrierOwner = () => useRoleCheck('carrier_owner');
