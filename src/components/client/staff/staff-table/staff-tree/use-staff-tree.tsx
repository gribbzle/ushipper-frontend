import React, { MouseEvent, useCallback } from 'react';
import { useMemo } from 'react';
import { toCamelCase } from 'js-convert-case';
import { useRouter } from 'next/router';
import { formatPhoneNumberIntl } from 'react-phone-number-input';

import { Button } from '@/components/common/button/button';
import { StatusBlock, StatusBlockView } from '@/components/common/status-block/status-block';
import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { TableColumn } from '@/components/common/table/table.types';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { PlusIcon } from '@icons';
import { useAppDispatch } from '@store';
import { User } from '@store/common';
import { staffActions } from '@store/common/staff/slice';
import { classname } from '@utils/classname';
import { formatDateOrGetDash } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';

import { UseStaffTreeProps } from '../staff-table.types';
import { useStaffTable } from '../use-staff-table';

import { CounterLink } from './counter-link/counter-link';

import '../staff-table.scss';

const cn = classname('staff-table');

const tTable = translateByNamespace('common:staff-table');
const tUserStatuses = translateByNamespace('common:staff-filters:user-statuses-labels');

const USER_STATUSES_LABELS: any = {
    active: tUserStatuses('active'),
    pendingConfirmation: tUserStatuses('pending-confirmation'),
    blocked: tUserStatuses('blocked'),
};

export const useStaffTree = ({ onRowClick }: UseStaffTreeProps) => {
    const { filters, isMeAdmin, isMeOwner, onOrderChangeHandler, onRowClickHandler } = useStaffTable({ onRowClick });

    const dispatch = useAppDispatch();

    const router = useRouter();

    const handleOpenAssignDrawer = useCallback(
        async ({
            event,
            roleName,
            superiorUserPublicId,
            userName,
        }: {
            event: MouseEvent;
            superiorUserPublicId: string;
            roleName: string;
            userName: string;
        }) => {
            event.stopPropagation();

            dispatch(staffActions.openAssignDrawer({ roleName, superiorUserPublicId, userName }));
        },
        [dispatch],
    );

    const handleOpenDriverOrders = useCallback(
        (e: MouseEvent, publicId: string) => {
            e.stopPropagation();

            router.push({
                pathname: 'orders',
                query: {
                    drivers: publicId,
                },
            });
        },
        [router],
    );

    const columns = useMemo<TableColumn<User>[]>(
        () => [
            {
                key: 'name',
                name: tTable('user-and-role-column-name'),
                isSortable: true,
                cellRender: ({ row }) => <UserInfoBlock trimName={true} {...row} />,
            },
            {
                key: 'assignUsers',
                name: tTable('assign-users'),
                cellRender: ({
                    row: {
                        publicId,
                        name,
                        roleName,
                        roleIsSubordinationAllowed,
                        subordinatesDispatchersCount,
                        subordinatesDriversCount,
                        ordersCount,
                        roleType,
                    },
                    onOpenCollapse,
                }) => (
                    <div className={cn('assign-users-wrapper')}>
                        <span className={cn('counts')}>
                            {roleType === 'carrier_driver' ? (
                                <CounterLink onClick={event => handleOpenDriverOrders(event, publicId)} amount={ordersCount}>
                                    {ordersCount === 1 ? tTable('order') : tTable('orders')}
                                </CounterLink>
                            ) : (
                                <CounterLink onClick={onOpenCollapse} amount={subordinatesDispatchersCount + subordinatesDriversCount}>
                                    {subordinatesDispatchersCount + subordinatesDriversCount === 1 ? tTable('user') : tTable('users')}
                                </CounterLink>
                            )}
                        </span>
                        {roleIsSubordinationAllowed && (
                            <Button onClick={event => handleOpenAssignDrawer({ event, superiorUserPublicId: publicId, roleName, userName: name })} size='small'>
                                <PlusIcon />
                                {tTable('add')}
                            </Button>
                        )}
                    </div>
                ),
            },
            {
                key: 'phoneAndEmail',
                name: tTable('phone-and-email-column-name'),
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
                cellRender: ({ value }) => formatDateOrGetDash(value),
            },
            { key: 'createdAt', name: tTable('created-at-column-name'), isSortable: true, cellRender: ({ value }) => formatDateOrGetDash(value) },
            { key: 'updatedAt', name: tTable('updated-at-column-name'), isSortable: true, cellRender: ({ value }) => formatDateOrGetDash(value) },
            {
                key: 'actions',
                name: '',
                cellRender: ({ row: { publicId, name, roleType } }) =>
                    isMeAdmin || isMeOwner || !roleType.includes('owner') ? (
                        <TableRowMenu
                            dataTestId='staff-table-actions'
                            options={[
                                {
                                    label: tTable('edit-button-label'),
                                    onClick: () => {
                                        onRowClick(publicId);
                                        dispatch(staffActions.setCreateEditModalProps({ isVisible: true, mode: 'edit', userId: publicId }));
                                    },
                                },
                                {
                                    label: tTable('delete-button-label'),
                                    onClick: () => {
                                        dispatch(staffActions.setDeleteUserPopupProps({ isVisible: true, userId: publicId, userName: name }));
                                    },
                                },
                            ]}
                        />
                    ) : null,
            },
        ],
        [dispatch, handleOpenAssignDrawer, handleOpenDriverOrders, isMeAdmin, isMeOwner, onRowClick],
    );

    return { columns, filters, onRowClickHandler, onOrderChangeHandler };
};
