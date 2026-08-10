import React, { useCallback, useMemo } from 'react';

import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { Table } from '@/components/common/table/table';
import { TableColumn } from '@/components/common/table/table.types';
import { UserRoleType } from '@/enums/user-role-type';
import { useEffectOnce } from '@/hooks/use-effect-once';
import { useAppDispatch, useAppSelector } from '@store';
import { clickedRowIdSelector, fetchedRolesSelector, fetchRoleAction, fetchRolesAction, UserRole } from '@store/common';
import { rolesSettingsActions } from '@store/common/roles-settings/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './roles-table.scss';

const cn = classname('roles-table');
const t = translateByNamespace('common:roles-page');

export const RolesTable = () => {
    const dispatch = useAppDispatch();
    const fetchedRoles = useAppSelector(fetchedRolesSelector);
    const clickedRowId = useAppSelector(clickedRowIdSelector);

    const onRowClickHandler = useCallback(
        (role: UserRole) => {
            if (role.id === clickedRowId) {
                return;
            }

            dispatch(rolesSettingsActions.setClickedRowId(role.id));
            dispatch(fetchRoleAction(role.id));
            dispatch(rolesSettingsActions.setCreateUpdateRoleBlockProps({ mode: 'edit', roleId: role.id }));
        },
        [dispatch, clickedRowId],
    );

    useEffectOnce(() => {
        dispatch(fetchRolesAction())
            .unwrap()
            .then(roles => {
                onRowClickHandler(roles[0]);
            })
            .catch(() => undefined);
    }, [onRowClickHandler]);

    const columns = useMemo<TableColumn<UserRole>[]>(
        () => [
            { key: 'name', name: t('role-name-column-label'), cellClassName: cn('cell'), headerCellClassName: cn('header-cell') },
            { key: 'countActiveUsers', name: t('active-users-column-label'), cellClassName: cn('cell'), headerCellClassName: cn('header-cell') },
            {
                key: 'actions',
                name: '',
                cellRender: ({ row: { id, name, editable } }) =>
                    editable !== false && (
                        <div className={cn('roles-table-actions-cell')}>
                            <TableRowMenu
                                dataTestId='roles-table-actions'
                                options={[
                                    {
                                        label: 'Edit',
                                        onClick: () => {
                                            dispatch(rolesSettingsActions.setClickedRowId(id));
                                            dispatch(fetchRoleAction(id));
                                            dispatch(rolesSettingsActions.setCreateUpdateRoleBlockProps({ mode: 'edit', roleId: id }));
                                        },
                                    },
                                    {
                                        label: 'Delete',
                                        onClick: () => {
                                            dispatch(
                                                rolesSettingsActions.setDeleteRolePopupProps({
                                                    isVisible: true,
                                                    roleId: id,
                                                    roleName: name,
                                                }),
                                            );
                                        },
                                    },
                                ]}
                            />
                        </div>
                    ),
                cellClassName: cn('cell'),
                headerCellClassName: cn('header-cell'),
            },
        ],
        [dispatch],
    );

    const data = useMemo(
        () =>
            fetchedRoles?.map(role => {
                if ([UserRoleType.CARRIER_OWNER, UserRoleType.SHIPPER_OWNER].includes(role.type)) {
                    return {
                        ...role,
                        editable: false,
                    };
                }

                return role;
            }),
        [fetchedRoles],
    );

    return (
        <Table<UserRole>
            className={cn()}
            columns={columns}
            data={data ?? []}
            isRowClickable={() => true}
            highlightClickedRow={true}
            onRowClick={onRowClickHandler}
            clickedRowId={clickedRowId}
        />
    );
};
