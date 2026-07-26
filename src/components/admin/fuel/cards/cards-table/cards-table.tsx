import React from 'react';

import { EmptyLayout, Table } from '@/components/common';
import { FuelCard } from '@store/admin';
import { translateByNamespace } from '@utils';

import { useCardsTable } from './use-cards-table';

import './cards-table.scss';

const t = translateByNamespace('admin:fuel:cards-page');

export const FuelCardsTable = () => {
    const {
        cardsPaginateData,
        isSuccess,
        columns,
        filters: { page, orderDirection, orderName, perPage },
        hasFuelCardsActionsPermission,
        onPerPageChangeHandler,
        onPageChangeHandler,
        onOrderChangeHandler,
    } = useCardsTable();

    if (!isSuccess) {
        return null;
    }

    if (cardsPaginateData?.data.length) {
        return (
            <Table<FuelCard>
                columns={columns}
                orderName={orderName}
                orderDirection={orderDirection}
                data={cardsPaginateData.data}
                isRowClickable={() => hasFuelCardsActionsPermission}
                onOrderChange={onOrderChangeHandler}
                isSticky={true}
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
