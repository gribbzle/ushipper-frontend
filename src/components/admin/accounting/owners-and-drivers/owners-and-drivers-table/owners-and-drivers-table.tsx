import React from 'react';

import { EmptyLayout, Table } from '@/components/common';
import { AccountingAccountData } from '@store/api/accounting-accounts-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useOwnersAndDriversTable } from './use-owners-and-drivers-table';

import './owners-and-drivers-table.scss';
const t = translateByNamespace('admin:accounting:carriers');
const tDriver = translateByNamespace('common:sidebar');
const cn = classname('owners-and-drivers-table');

export const OwnersAndDriversTable = () => {
    const {
        filters: { page, orderDirection, orderName, perPage },
        driversAccountingData,
        isSuccess,
        onOrderChangeHandler,
        onPageChangeHandler,
        onPerPageChangeHandler,
        onRowClickHandler,
        columns,
    } = useOwnersAndDriversTable();

    if (!isSuccess) {
        return null;
    }

    if (driversAccountingData?.data.length) {
        return (
            <Table<AccountingAccountData>
                columns={columns}
                orderName={orderName}
                orderDirection={orderDirection}
                data={driversAccountingData.data}
                isRowClickable={() => true}
                onRowClick={onRowClickHandler}
                onOrderChange={onOrderChangeHandler}
                className={cn('')}
                isSticky={true}
                paginationProps={{
                    page,
                    perPage,
                    lastPage: driversAccountingData.meta.lastPage,
                    from: driversAccountingData.meta.from,
                    to: driversAccountingData.meta.to,
                    total: driversAccountingData.meta.total,
                    onPageChange: onPageChangeHandler,
                    onChangePerPage: onPerPageChangeHandler,
                }}
                stickyColumnsProps={{
                    stickyLeftColumns: 2,
                }}
            />
        );
    }

    return <EmptyLayout title={t('no-data-title', { user: tDriver('drivers-tab-label') })} subTitle={t('no-data-description')} />;
};
