import React from 'react';

import { EmptyLayout } from '@/components/common';
import { translateByNamespace } from '@utils';

import { BalanceTable, useBalanceTable } from '../../common';

const t = translateByNamespace('admin:accounting');

export const TransactionsTable = () => {
    const { transactionsPaginateData, isSuccess } = useBalanceTable({});

    if (!isSuccess) {
        return null;
    }

    if (transactionsPaginateData?.data.length) {
        return <BalanceTable />;
    }

    return <EmptyLayout title={t('no-data-title')} subTitle={t('no-data-description')} />;
};
