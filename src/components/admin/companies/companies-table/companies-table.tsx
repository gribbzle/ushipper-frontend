import React from 'react';

import { Paper, Table, TableLoader } from '@/components/common';
import { Company } from '@store/admin';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { useCompaniesTable } from './use-companies-table';

import './companies-table.scss';

const cn = classname('companies-table');
const tTable = translateByNamespace('common:staff-table');

export const CompaniesTable = () => {
    const {
        hasPermission,
        companiesData,
        isSuccess,
        isFetching,
        columns,
        filters: { page, orderDirection, orderName, perPage },
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
        onRowClickHandler,
    } = useCompaniesTable();

    if (isFetching) {
        return <TableLoader />;
    }

    if (!isSuccess) {
        return null;
    }

    return (
        <div className={cn()}>
            {companiesData?.data.length ? (
                <Table<Company>
                    columns={columns}
                    data={companiesData.data}
                    orderName={orderName}
                    orderDirection={orderDirection}
                    isRowClickable={() => hasPermission}
                    onRowClick={onRowClickHandler}
                    onOrderChange={onOrderChangeHandler}
                    isSticky={true}
                    paginationProps={{
                        page,
                        perPage,
                        lastPage: companiesData?.meta.lastPage,
                        from: companiesData?.meta.from,
                        total: companiesData?.meta.total,
                        to: companiesData?.meta.to,
                        onPageChange: onPageChangeHandler,
                        onChangePerPage: onPerPageChangeHandler,
                    }}
                />
            ) : (
                <Paper body={<div className={cn('no-data')}>{tTable('no-data-filter', { users: tTable('companies') })}</div>} />
            )}
        </div>
    );
};
