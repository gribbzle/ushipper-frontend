import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { UserRoleGroup } from '@/enums';
import { AppState } from '@store';

import { useMeCarrierDriver } from './use-user-role-type';

export const authorizedUserRoleGroupSelector = (state: AppState) => state.global.user?.roleGroup;

export const useUserRoleGroup = () => {
    const roleGroup = useSelector(authorizedUserRoleGroupSelector);

    return useMemo(() => roleGroup, [roleGroup]);
};

export const useMeShipper = () => {
    const userRoleGroup = useUserRoleGroup();

    return useMemo(() => userRoleGroup === UserRoleGroup.SHIPPERS, [userRoleGroup]);
};

export const useMeCarrier = () => {
    const userRoleGroup = useUserRoleGroup();

    return useMemo(() => userRoleGroup === UserRoleGroup.CARRIERS, [userRoleGroup]);
};

export const useMeDispatcher = () => {
    const userRoleGroup = useUserRoleGroup();

    return useMemo(() => userRoleGroup === UserRoleGroup.DISPATCHERS, [userRoleGroup]);
};

export const useMeDriver = () => {
    const userRoleGroup = useUserRoleGroup();

    return useMemo(() => userRoleGroup === UserRoleGroup.DRIVERS, [userRoleGroup]);
};

export const useMeAdmin = () => {
    const userRoleGroup = useUserRoleGroup();

    return useMemo(() => userRoleGroup === UserRoleGroup.ADMINISTRATORS, [userRoleGroup]);
};

export const useMeDriverRelated = () => {
    const isMeCarrierDriver = useMeCarrierDriver();
    const isMeDriverOwner = useMeDriver();
    const isDriver = isMeDriverOwner || isMeCarrierDriver;

    return isDriver;
};
