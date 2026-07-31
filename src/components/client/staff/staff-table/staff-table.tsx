import React, { memo, useCallback } from 'react';

import { usePagination, useTable } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { useGetUsersQuery } from '@store/api/users-api';
import { usersFiltersSelector } from '@store/client';
import { staffActions } from '@store/common/staff/slice';
import { authorizedUserPublicIdSelector } from '@store/global';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import { StaffList } from './staff-list/staff-list';
import { StaffTree } from './staff-tree/staff-tree';
import { StaffTableProps } from './staff-table.types';

import './staff-table.scss';

const specificFilters = ['name', 'phone', 'roleId', 'status'] as const;

export const StaffTable = memo(({ onRowClick, pageName, view, disabled }: StaffTableProps) => {
    const filters = useAppSelector(usersFiltersSelector);
    const dispatch = useAppDispatch();
    const { onPageChangeHandler: onPageChange } = usePagination();
    const { onPerPageChangeHandler: onPerPageChange } = useTable();
    const authorizedUserPUblicId = useAppSelector(authorizedUserPublicIdSelector);

    const hasSpecificFilters = specificFilters.some(key => filters[key]);

    const {
        data: usersPaginateData,
        isSuccess,
        isFetching,
    } = useGetUsersQuery({
        ...getObjectWithoutEmptyFields({
            ...filters,
            page: filters.page ?? 1,
            phone: filters.phone?.replace(/\s+/g, ''),
        }),
        ...(view === 'tree' ? { superiorUserPublicId: hasSpecificFilters ? authorizedUserPUblicId : '' } : {}),
    });

    const onPageChangeHandler = useCallback(
        (page: number) => {
            dispatch(staffActions.setFilters({ ...filters, page }));
            onPageChange(page);
        },
        [dispatch, onPageChange, filters],
    );

    const onPerPageChangeHandler = useCallback(
        (perPage: number) => {
            dispatch(staffActions.setFilters({ perPage, page: 1 }));

            onPerPageChange(perPage);
        },
        [dispatch, onPerPageChange],
    );

    if (!isSuccess || isFetching) {
        return null;
    }

    return (
        <>
            {pageName === 'staff' && view === 'tree' ? (
                <StaffTree pageName={pageName} onRowClick={onRowClick} fetchedUsers={usersPaginateData.data} />
            ) : (
                <StaffList
                    pageName={pageName}
                    onRowClick={onRowClick}
                    fetchedUsers={usersPaginateData.data}
                    disabled={disabled}
                    paginationProps={{
                        page: filters.page ?? 1,
                        lastPage: usersPaginateData?.lastPage,
                        onPageChange: onPageChangeHandler,
                        perPage: usersPaginateData?.perPage,
                        onChangePerPage: onPerPageChangeHandler,
                        from: usersPaginateData?.from,
                        to: usersPaginateData?.to,
                        total: usersPaginateData?.total,
                    }}
                />
            )}
        </>
    );
});

StaffTable.displayName = 'StaffTable';
