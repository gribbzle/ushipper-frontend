import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { TableLoader } from '@/components/common/table/common/table-loader/table-loader';
import { BalanceType } from '@/enums';
import { translateByNamespace } from '@utils/i18n';

import { BalanceTable, useBalanceTable } from '../../common/balance-table';

const t = translateByNamespace('admin:accounting');

export const BrokerFeeBalanceTable = () => {
    const { transactionsPaginateData, isSuccess, isLoading } = useBalanceTable({ balanceType: BalanceType.BROKER_WALLET });

    if (isLoading) {
        return <TableLoader />;
    }

    if (!isSuccess) {
        return null;
    }

    if (transactionsPaginateData?.data.length) {
        return <BalanceTable balanceType={BalanceType.BROKER_WALLET} />;
    }

    return <EmptyLayout title={t('no-data-title')} subTitle={t('no-data-description')} />;
};
