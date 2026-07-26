import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { toCamelCase } from 'js-convert-case';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

import { AppAndDeviceInfo, DateInfo, Link, StatusBlock, StatusBlockView, TableColumn, TableRowMenu, UserInfoBlock } from '@/components/common';
import { UserRoleType } from '@/enums';
import { useLoginAs } from '@hooks';
import { useAppDispatch } from '@store';
import { User } from '@store/common';
import { staffActions } from '@store/common/staff/slice';
import { formatDateOrGetDash, translateByNamespace } from '@utils';

import { UseStaffListProps } from '../staff-table.types';
import { useStaffTable } from '../use-staff-table';

import '../staff-table.scss';

const tTable = translateByNamespace('common:staff-table');
const tUserStatuses = translateByNamespace('common:staff-filters:user-statuses-labels');

const USER_STATUSES_LABELS: any = {
    active: tUserStatuses('active'),
    pendingConfirmation: tUserStatuses('pending-confirmation'),
    blocked: tUserStatuses('blocked'),
};

export const useStaffList = ({ onRowClick, pageName, disabled }: UseStaffListProps) => {
    const { filters, isMeAdmin, isMeOwner, onOrderChangeHandler, onRowClickHandler } = useStaffTable({ onRowClick });
    const dispatch = useAppDispatch();
    const isUsersPage = pageName === 'users';

    const handleLoginAs = useLoginAs();

    const handleLoginAsHandler = useCallback(
        (isNewAccountDispatcher: boolean, account: string) => handleLoginAs({ userPublicId: account, isNewAccountDispatcher }),
        [handleLoginAs],
    );

    const columns = useMemo<TableColumn<User>[]>(
        () => [
            {
                key: 'id',
                name: tTable('id-column-name'),
                hide: !isUsersPage,
            },
            {
                key: 'name',
                name: tTable('user-and-role-column-name'),
                isSortable: true,
                cellRender: ({ row }) => <UserInfoBlock {...row} />,
            },
            {
                key: 'phone',
                name: tTable('phone-column-name'),
                hide: isUsersPage,
                isSortable: true,
                cellRender: ({ value }) => formatPhoneNumberIntl(value),
            },
            { key: 'email', name: 'Email', hide: isUsersPage, isSortable: true },
            {
                key: 'phoneAndEmail',
                name: tTable('phone-and-email-column-name'),
                hide: !isUsersPage,
                cellRender: ({ row }) => {
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{formatPhoneNumberIntl(row.phone)}</span>
                            <span>{row.email}</span>
                        </div>
                    );
                },
            },
            {
                key: 'companyName',
                name: tTable('company-column-name'),
                hide: !isUsersPage,
                cellRender: ({ value }) => {
                    return (
                        <Link
                            onClick={e => {
                                e.stopPropagation();
                            }}
                            href={{ pathname: '/admin/companies', query: { name: value } }}
                        >
                            {value}
                        </Link>
                    );
                },
            },
            {
                key: 'appAndDevice',
                name: tTable('app-and-device-column-name'),
                hide: !isUsersPage,
                cellRender: ({ row }) => <AppAndDeviceInfo info={row.deviceInformation} />,
            },
            {
                key: 'status',
                name: tTable('status-column-name'),
                isSortable: true,
                cellRender: ({ value }) => {
                    let view: StatusBlockView;

                    if (value === 'active') {
                        view = 'success';
                    } else if (value === 'blocked') {
                        view = 'danger';
                    } else {
                        view = 'warning';
                    }

                    return <StatusBlock view={view}>{USER_STATUSES_LABELS[toCamelCase(value)]}</StatusBlock>;
                },
            },
            {
                key: 'lastLoginedAt',
                name: tTable('last-logined-at-column-name'),
                isSortable: true,
                cellRender: ({ value }) => (isUsersPage ? <DateInfo date={value} /> : formatDateOrGetDash(value)),
            },
            {
                key: 'createdAt',
                name: tTable('created-at-column-name'),
                isSortable: true,
                cellRender: ({ value }) => (isUsersPage ? <DateInfo date={value} /> : formatDateOrGetDash(value)),
            },
            {
                key: 'updatedAt',
                name: tTable('updated-at-column-name'),
                isSortable: true,
                cellRender: ({ value }) => (isUsersPage ? <DateInfo date={value} /> : formatDateOrGetDash(value)),
            },
            {
                key: 'actions',
                name: '',
                hide: disabled,
                cellRender: ({ row: { publicId, name, roleType, accountPublicId } }) => {
                    const isOwner = roleType.includes('owner');
                    const canPerformActions = isMeAdmin || isMeOwner || !isOwner;

                    if (!canPerformActions) return null;

                    const options = [
                        {
                            label: tTable('edit-button-label'),
                            onClick: () => {
                                onRowClick(publicId);
                                dispatch(
                                    staffActions.setCreateEditModalProps({
                                        isVisible: true,
                                        mode: 'edit',
                                        userId: publicId,
                                    }),
                                );
                            },
                        },
                        {
                            label: tTable('delete-button-label'),
                            onClick: () => {
                                dispatch(staffActions.setDeleteUserPopupProps({ isVisible: true, userId: publicId, userName: name }));
                            },
                        },
                    ];

                    if (isUsersPage) {
                        options.unshift({
                            label: tTable('login-as-button-label'),
                            onClick: () => {
                                const isNewAccountDispatcher = [UserRoleType.DRIVER_OWNER, UserRoleType.DISPATCHER_OWNER].includes(roleType as UserRoleType);

                                handleLoginAsHandler(isNewAccountDispatcher, publicId);
                            },
                        });
                    }

                    return <TableRowMenu dataTestId='staff-table-actions' options={options} />;
                },
            },
        ],
        [dispatch, handleLoginAsHandler, disabled, isMeAdmin, isMeOwner, isUsersPage, onRowClick],
    );

    return {
        filters,
        columns,
        isUsersPage,
        onRowClickHandler,
        onOrderChangeHandler,
    };
};
