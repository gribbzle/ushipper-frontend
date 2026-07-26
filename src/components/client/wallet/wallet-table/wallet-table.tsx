import React from 'react';

import { EmptyLayout, Table, TableLoader } from '@/components/common';
import { Transaction } from '@store/admin';
import { classname, translateByNamespace } from '@utils';

import { useWalletTable } from './use-wallet-table';

import './wallet-table.scss';

const cn = classname('wallet-table');
const t = translateByNamespace('client:wallet-page:wallet-table');

export const WalletTable = () => {
    const {
        columns,
        transactionsPaginateData,
        isFetching,
        isSuccess,
        filters: { page, orderDirection, orderName, perPage },
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
    } = useWalletTable();

    if (isFetching) {
        return (
            <div className={cn('preloader')}>
                <TableLoader />
            </div>
        );
    }

    if (!isSuccess) {
        return null;
    }

    if (transactionsPaginateData?.data.length && transactionsPaginateData.data.length > 0) {
        return (
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
        );
    }

    return (
        <div className={cn('empty')}>
            <EmptyLayout title={t('no-data-title')} subTitle={t('no-data-description')} />
        </div>
    );
};
