import React from 'react';

import { User } from '@store/common';
import { classname } from '@utils/classname';

import { useVisibleColumns } from '../hooks';
import { TableProps } from '../table.types';
import { TableColumnHeaders } from '../table-column-headers';

import { CollapseTableRow } from './collapse-table-row';

import '../table.scss';
import './collapse-table.scss';

const cn = classname('table');

export const CollapseTable = ({
    columns = [],
    data = [],
    isRowClickable,
    onRowClick,
    clickedRowId = null,
    orderName,
    orderDirection,
    onOrderChange,
    className,
}: TableProps<User>) => {
    const { visibleColumns } = useVisibleColumns({ columns });

    return (
        <table className={cn('', [className])}>
            <thead>
                <tr>
                    <td className={cn('collapse-icon')}></td>
                    <TableColumnHeaders
                        columns={columns}
                        orderName={orderName}
                        orderDirection={orderDirection}
                        onOrderChange={onOrderChange}
                        visibleColumns={visibleColumns}
                        enableStickyColumns={false}
                    />
                </tr>
            </thead>
            <tbody>
                {data &&
                    data.length !== 0 &&
                    data.map(user => (
                        <CollapseTableRow
                            key={user.publicId}
                            user={user}
                            visibleColumns={visibleColumns}
                            isRowClickable={isRowClickable}
                            onRowClick={onRowClick}
                            clickedRowId={clickedRowId}
                        />
                    ))}
            </tbody>
        </table>
    );
};
