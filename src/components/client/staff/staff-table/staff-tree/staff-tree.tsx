import React from 'react';
import { toCamelCase } from 'js-convert-case';

import { Paper } from '@/components/common/paper/paper';
import { CollapseTable } from '@/components/common/table/collapse-table/collapse-table';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { StaffTreeProps } from '../staff-table.types';

import { useStaffTree } from './use-staff-tree';

import '../staff-table.scss';

const cn = classname('staff-table');
const tTable = translateByNamespace('common:staff-table');

export const StaffTree = ({ pageName, fetchedUsers, onRowClick }: StaffTreeProps) => {
    const { columns, filters, onRowClickHandler, onOrderChangeHandler } = useStaffTree({ onRowClick });

    return fetchedUsers?.length ? (
        <CollapseTable
            columns={columns}
            data={fetchedUsers}
            orderName={filters.orderName ? toCamelCase(filters.orderName) : null}
            orderDirection={filters.orderDirection}
            onOrderChange={onOrderChangeHandler}
            onRowClick={onRowClickHandler}
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
