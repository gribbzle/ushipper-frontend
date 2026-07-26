import React from 'react';

import { Table } from '@/components/common';
import { BalanceType } from '@/enums';
import { Transaction } from '@store/admin';

import { useBalanceTable } from './use-balance-table';

import './balance-table.scss';

export type BalanceTableProps = {
    balanceType?: BalanceType;
    balanceId?: string;
};

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
