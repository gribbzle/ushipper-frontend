import React from 'react';

import { Table } from '@/components/common';
import { Transaction } from '@store/admin';

import { BalanceTableProps } from './balance-table.types';
import { useBalanceTable } from './use-balance-table';

import './balance-table.scss';

export const BalanceTable = ({ balanceType, balanceId }: BalanceTableProps) => {
    const {
        columns,
        transactionsPaginateData,
        filters: { page, orderDirection, orderName, perPage },
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
    } = useBalanceTable({ balanceType, balanceId });

    if (!!transactionsPaginateData?.data.length) {
        return (
            <>
                {!!transactionsPaginateData?.data.length && (
                    <Table<Transaction>
                        columns={columns}
                        orderName={orderName}
                        orderDirection={orderDirection}
                        data={transactionsPaginateData.data}
                        isRowClickable={() => false}
                        onOrderChange={onOrderChangeHandler}
                        isSticky={true}
                        paginationProps={{
                            page,
                            perPage,
                            lastPage: transactionsPaginateData?.meta.lastPage,
                            from: transactionsPaginateData?.meta.from,
                            total: transactionsPaginateData?.meta.total,
                            to: transactionsPaginateData?.meta.to,
                            onPageChange: onPageChangeHandler,
                            onChangePerPage: onPerPageChangeHandler,
                        }}
                    />
                )}
            </>
        );
    }

    return null;
};
