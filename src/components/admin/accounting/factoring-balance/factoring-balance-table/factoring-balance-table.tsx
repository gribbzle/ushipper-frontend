import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { BalanceType } from '@/enums/balance-type';
import { translateByNamespace } from '@utils/i18n';

import { BalanceTable, useBalanceTable } from '../../common';

const t = translateByNamespace('admin:accounting');

export const FactoringBalanceTable = () => {
    const { transactionsPaginateData, isSuccess } = useBalanceTable({ balanceType: BalanceType.FACTORING_WALLET });

    if (!isSuccess) {
        return null;
    }

    if (transactionsPaginateData?.data.length) {
        return <BalanceTable balanceType={BalanceType.FACTORING_WALLET} />;
    }

    return <EmptyLayout title={t('no-data-title')} subTitle={t('no-data-description')} />;
};
