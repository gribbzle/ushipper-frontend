import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { BalanceType } from '@/enums/balance-type';
import { translateByNamespace } from '@utils/i18n';

import { BalanceTable } from '@/components/admin/accounting/common/balance-table/balance-table';
import { useBalanceTable } from '@/components/admin/accounting/common/balance-table/use-balance-table';

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
