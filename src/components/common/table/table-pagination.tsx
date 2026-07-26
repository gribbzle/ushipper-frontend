import React from 'react';

import { classname } from '@utils';

import { PaginateControl } from '../paginate-control';

import { TablePaginationProps } from './table.types';

import './table.scss';

export const getId: <T extends Record<string, unknown>>(row: T) => string = row => (row.id || row.publicId) as string;

const cn = classname('table');

export const TablePagination = ({ page, lastPage, perPage, from, to, total, onPageChange, onChangePerPage }: TablePaginationProps) => {
    if (!(lastPage && from && to && total)) {
        return null;
    }

    return (
        <PaginateControl
            page={page ?? 1}
            lastPage={lastPage}
            perPage={perPage ?? 20}
            from={from}
            to={to}
            total={total}
            onChangePerPage={onChangePerPage}
            onPageChange={onPageChange}
            className={cn('pagination')}
        />
    );
};
