import React from 'react';

import { Paginate, Table } from '@/components/common';
import { Load } from '@store/client';
import { classname } from '@utils';

import { useCompanyOrdersTable } from './use-company-orders-table';

import './company-orders-table.scss';

const cn = classname('company-orders-table');

export const CompanyOrdersTable = () => {
    const {
        ordersData,
        columns,
        onPageChangeHandler,
        filters: { page },
    } = useCompanyOrdersTable();

    return (
        <div className={cn()}>
            {!!ordersData?.data.length && <Table<Load> className={cn()} columns={columns} data={ordersData.data} isRowClickable={() => true} isThead={false} />}
            {ordersData?.meta.lastPage && ordersData.meta.lastPage > 1 && (
                <Paginate page={page} lastPage={ordersData.meta.lastPage} onChange={onPageChangeHandler} />
            )}
        </div>
    );
};
