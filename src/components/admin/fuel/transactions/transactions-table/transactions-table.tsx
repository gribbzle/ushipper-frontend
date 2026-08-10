import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { Table } from '@/components/common/table/table';
import { FuelTransaction } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

import { useTransactionsTable } from './use-transactions-table';

import './transactions-table.scss';

const t = translateByNamespace('admin:fuel:transactions-page');

export const FuelTransactionsTable = () => {
    const {
        cardsPaginateData,
        isSuccess,
        columns,
        filters: { page, orderDirection, orderName, perPage },
        onPerPageChangeHandler,
        onPageChangeHandler,
        onOrderChangeHandler,
    } = useTransactionsTable();

    if (!isSuccess) {
        return null;
    }

    if (cardsPaginateData?.data.length) {
        return (
            <Table<FuelTransaction>
                columns={columns}
                orderName={orderName}
                orderDirection={orderDirection}
                data={cardsPaginateData.data}
                isRowClickable={() => false}
                isSticky={true}
                onOrderChange={onOrderChangeHandler}
                paginationProps={{
                    page,
                    perPage,
                    lastPage: cardsPaginateData?.meta.lastPage,
                    from: cardsPaginateData?.meta.from,
                    total: cardsPaginateData?.meta.total,
                    to: cardsPaginateData?.meta.to,
                    onPageChange: onPageChangeHandler,
                    onChangePerPage: onPerPageChangeHandler,
                }}
            />
        );
    }

    return <EmptyLayout title={t('no-data-title')} subTitle={t('no-data-description')} />;
};
