import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { translateByNamespace } from '@utils/i18n';

import { BalanceTable, useBalanceTable } from '../../common/balance-table';

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
