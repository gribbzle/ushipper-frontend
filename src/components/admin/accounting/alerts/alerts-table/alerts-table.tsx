import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { Table } from '@/components/common/table/table';
import { TableLoader } from '@/components/common/table/common/table-loader/table-loader';
import { translateByNamespace } from '@utils/i18n';

import { IssueDataWithOrder, useAlertsTable } from './use-alerts-table';
import { useAlertsTableColumns } from './useAlertsTableColumns';

import './alerts-table.scss';

const t = translateByNamespace('admin:accounting:alerts');

export const AlertsTable = () => {
    const { metaData, alerts, isSuccess, isLoading, filters, onPerPageChangeHandler, onPageChangeHandler, onOrderChangeHandler } = useAlertsTable();
    const columns = useAlertsTableColumns();

    if (isLoading) {
        return <TableLoader />;
    }

    if (!isSuccess) {
        return null;
    }

    if (alerts.length) {
        return (
            <Table<IssueDataWithOrder>
                columns={columns}
                data={alerts}
                orderName={filters.orderName}
                orderDirection={filters.orderDirection}
                isRowClickable={() => false}
                onOrderChange={onOrderChangeHandler}
                isSticky={true}
                paginationProps={{
                    page: filters.page,
                    perPage: filters.perPage,
                    lastPage: metaData?.lastPage,
                    from: metaData?.from,
                    to: metaData?.to,
                    total: metaData?.total,
                    onPageChange: onPageChangeHandler,
                    onChangePerPage: onPerPageChangeHandler,
                }}
                stickyColumnsProps={{
                    stickyLeftColumns: 2,
                }}
            />
        );
    }

    return <EmptyLayout title={t('no-data-title')} />;
};
