import React from 'react';

import { EmptyLayout } from '@/components/common/empty-layout/empty-layout';
import { useAppSelector } from '@store';
import { fetchedBalanceSelector } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

import { BalanceTable } from '@/components/admin/accounting/common/balance-table/balance-table';
import { useBalanceTable } from '@/components/admin/accounting/common/balance-table/use-balance-table';

const t = translateByNamespace('admin:accounting');

export const CustomBalanceTable = () => {
    const balance = useAppSelector(fetchedBalanceSelector);

    const { transactionsPaginateData, isSuccess } = useBalanceTable({ balanceId: balance?.accountId });

    if (!isSuccess) {
        return null;
    }

    if (transactionsPaginateData?.data.length) {
        return <BalanceTable balanceId={balance?.accountId} />;
    }

    return <EmptyLayout title={t('no-data-title')} subTitle={t('no-data-description')} />;
};
