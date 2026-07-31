import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { TableLoader } from '@/components/common/table/common/table-loader/table-loader';
import { Table } from '@/components/common/table/table';
import { Transaction } from '@store/admin';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

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
