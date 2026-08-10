import React, { useMemo } from 'react';

import { StatisticCounter } from '@/components/common/statistic-counter';
import { BalanceType } from '@/enums/balance-type';
import { FinancialBalanceData } from '@store/admin';
import { useGetBalancesQuery } from '@store/api/balances-api';
import { translateByNamespace } from '@utils/i18n';

import './accounting-statistic-counters.scss';

type AccountingStatisticCountersProps = {
    type?: BalanceType;
    balance?: FinancialBalanceData;
};

const t = translateByNamespace('admin:accounting');
const COUNTER_COLOR = '#6ea2e7';
const PENDING_COUNTER_COLOR = '#e6a23c';

export const AccountingStatisticCounters = ({ type, balance: externalData }: AccountingStatisticCountersProps) => {
    const { data: fetchedData } = useGetBalancesQuery({ types: [type!] }, { skip: !type || !!externalData });

    const counters = useMemo(() => {
        const data = externalData || fetchedData?.data?.[0];

        if (!data) {
            return;
        }

        const { balance, pendingDeposit, pendingWithdrawal } = data;

        return {
            balance: balance.formatted ?? undefined,
            pendingDeposit: pendingDeposit.formatted ?? undefined,
            pendingWithdrawal: pendingWithdrawal.formatted ?? undefined,
        };
    }, [fetchedData?.data, externalData]);

    if (!counters) {
        return null;
    }

    const { balance, pendingDeposit, pendingWithdrawal } = counters;

    return (
        <div className='accounting-statistic-counters'>
            {balance && <StatisticCounter color={COUNTER_COLOR} counter={balance} title={t('total-balance')} />}
            {pendingDeposit && <StatisticCounter color={PENDING_COUNTER_COLOR} counter={pendingDeposit} title={t('pending-deposit')} />}
            {pendingWithdrawal && <StatisticCounter color={PENDING_COUNTER_COLOR} counter={pendingWithdrawal} title={t('pending-withdrawal')} />}
        </div>
    );
};
