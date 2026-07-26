import React from 'react';

import { EmptyLayout, Table } from '@/components/common';
import { FinancialBalanceData } from '@store/admin';
import { translateByNamespace } from '@utils';

import { useWalletsTable } from './use-wallets-table';

import './wallets-table.scss';

const t = translateByNamespace('admin:accounting:wallets-page:table');
const tSubText = translateByNamespace('admin:accounting');

export const WalletsTable = () => {
    const {
        columns,
        walletsPaginateData,
        isSuccess,
        filters: { page, orderDirection, orderName, perPage },
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
    } = useWalletsTable();

    if (!isSuccess) {
        return null;
    }

    if (!!walletsPaginateData?.data.length) {
        return (
            <Table<FinancialBalanceData>
                columns={columns}
                orderName={orderName}
                orderDirection={orderDirection}
                data={walletsPaginateData.data}
                isRowClickable={() => false}
                onOrderChange={onOrderChangeHandler}
                isSticky={true}
                paginationProps={{
                    page,
                    perPage,
                    lastPage: walletsPaginateData?.meta.lastPage,
                    from: walletsPaginateData?.meta.from,
                    total: walletsPaginateData?.meta.total,
                    to: walletsPaginateData?.meta.to,
                    onPageChange: onPageChangeHandler,
                    onChangePerPage: onPerPageChangeHandler,
                }}
            />
        );
    }

    return <EmptyLayout title={t('no-data-title')} subTitle={tSubText('no-data-description')} />;
};
