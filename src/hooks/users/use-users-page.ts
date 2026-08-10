import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { getUserFiltersFromUrlParams } from '@/components/client/staff/staff-table/utils';
import { UserRoleGroup } from '@/enums/user-role-group';
import { useEffectOnce } from '@hooks/use-effect-once';
import { useAppDispatch, useAppSelector } from '@store';
import { fetchUserAction, fetchUserRolesAction, isCreateEditUserModalVisibleSelector, StaffFilters } from '@store/client';
import { staffActions } from '@store/common/staff/slice';
import { authorizedUserCompanyPublicIdSelector } from '@store/global';

export const useUsersPage = (page: 'users' | 'administrators' | 'staff') => {
    const dispatch = useAppDispatch();
    const params = useSearchParams();
    const [filtersReady, setFiltersReady] = useState(false);
    const isCreateEditUserModalVisible = useAppSelector(isCreateEditUserModalVisibleSelector);
    const authorizedUserCompanyPublicId = useAppSelector(authorizedUserCompanyPublicIdSelector);

    const getStateAdministratorsFiltersFromUrlParams = useMemo<Partial<StaffFilters>>(
        () => getUserFiltersFromUrlParams(params, { roleGroup: UserRoleGroup.ADMINISTRATORS }),
        [params],
    );

    const getStateUsersFiltersFromUrlParams = useMemo<Partial<StaffFilters>>(
        () => getUserFiltersFromUrlParams(params, { excludeRoleGroup: UserRoleGroup.ADMINISTRATORS }),
        [params],
    );

    const getStateStaffFiltersFromUrlParams = useMemo<Partial<StaffFilters>>(() => getUserFiltersFromUrlParams(params), [params]);

    useEffectOnce(() => {
        if (page === 'users' || page === 'administrators') {
            dispatch(staffActions.clearFilters());
        }

        if (page === 'staff') {
            dispatch(fetchUserRolesAction(authorizedUserCompanyPublicId as string));
        }

        dispatch(
            staffActions.setFilters(
                page === 'users'
                    ? getStateUsersFiltersFromUrlParams
                    : page === 'staff'
                    ? getStateStaffFiltersFromUrlParams
                    : getStateAdministratorsFiltersFromUrlParams,
            ),
        );
        setFiltersReady(true);
    }, [dispatch]);

    const onModalCloseHandler = useCallback(() => {
        dispatch(staffActions.setCreateEditModalProps({ isVisible: false, mode: null, userId: null }));
    }, [dispatch]);

    const fetchUser = useCallback(
        (id: number | string) => {
            dispatch(fetchUserAction(id.toString()));
        },
        [dispatch],
    );

    return { filtersReady, isCreateEditUserModalVisible, fetchUser, onModalCloseHandler };
};
