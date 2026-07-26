import { useCallback } from 'react';
import { toSnakeCase } from 'js-convert-case';
import { useRouter } from 'next/router';

import { useMeAdmin, useMeOwner } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { User, usersFiltersSelector } from '@store/common';
import { staffActions } from '@store/common/staff/slice';

import { UseStaffTableProps } from './staff-table.types';

export const useStaffTable = ({ onRowClick }: UseStaffTableProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const isMeOwner = useMeOwner();
    const isMeAdmin = useMeAdmin();
    const filters = useAppSelector(usersFiltersSelector);

    const onOrderChangeHandler = useCallback(
        (orderName: string, orderDirection: string) => {
            dispatch(staffActions.setFilters({ orderName: toSnakeCase(orderName), orderDirection }));
            router.replace({ pathname: router.pathname, query: { ...router.query, orderName: toSnakeCase(orderName), orderDirection } });
        },
        [dispatch, router],
    );

    const onRowClickHandler = useCallback(
        (user: User) => {
            onRowClick(user.publicId);

            dispatch(
                staffActions.setCreateEditModalProps({
                    isVisible: true,
                    mode: 'edit',
                    userId: user.publicId,
                }),
            );
        },
        [dispatch, onRowClick],
    );

    return {
        filters,
        isMeAdmin,
        isMeOwner,
        onRowClickHandler,
        onOrderChangeHandler,
    };
};
