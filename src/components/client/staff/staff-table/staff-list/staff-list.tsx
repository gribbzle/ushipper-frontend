import React from 'react';
import { toCamelCase } from 'js-convert-case';

import { Paper } from '@/components/common/paper/paper';
import { Table } from '@/components/common/table/table';
import { User } from '@store/common';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { StaffListProps } from '../staff-table.types';

import { useStaffList } from './use-staff-list';

import '../staff-table.scss';

const cn = classname('staff-table');
const tTable = translateByNamespace('common:staff-table');

export const StaffList = ({ pageName, onRowClick, fetchedUsers, disabled = false, paginationProps }: StaffListProps) => {
    const { columns, filters, isUsersPage, onOrderChangeHandler, onRowClickHandler } = useStaffList({ pageName, onRowClick, disabled });

    return fetchedUsers?.length ? (
        <Table<User>
            columns={columns}
            data={fetchedUsers}
            orderName={filters.orderName ? toCamelCase(filters.orderName) : null}
            orderDirection={filters.orderDirection}
            onOrderChange={onOrderChangeHandler}
            isRowClickable={() => !disabled}
            onRowClick={onRowClickHandler}
            isSticky={true}
            paginationProps={paginationProps}
            stickyColumnsProps={{
                stickyLeftColumns: isUsersPage ? 2 : 1,
            }}
        />
    ) : (
        <Paper
            body={
                <div className={cn('no-data')}>
                    {tTable('no-data-filter', { users: pageName === 'administrators' ? tTable('administrators') : tTable('users') })}
                </div>
            }
        />
    );
};
