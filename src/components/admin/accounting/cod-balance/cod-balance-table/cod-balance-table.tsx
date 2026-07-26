import React from 'react';

import { EmptyLayout } from '@/components/common';
import { BalanceType } from '@/enums';
import { translateByNamespace } from '@utils';

import { BalanceTable, useBalanceTable } from '../../common';

const t = translateByNamespace('admin:accounting');

export const CODBalanceTable = () => {
    const { transactionsPaginateData, isSuccess } = useBalanceTable({ balanceType: BalanceType.COD_WALLET });

    if (!isSuccess) {
        return null;
    }

    if (transactionsPaginateData?.data.length) {
        return <BalanceTable balanceType={BalanceType.COD_WALLET} />;
    }

    return <EmptyLayout title={t('no-data-title')} subTitle={t('no-data-description')} />;
};
