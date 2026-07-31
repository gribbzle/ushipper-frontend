import React, { useMemo } from 'react';

import { StatisticCounter } from '@/components/common/statistic-counter';
import { useAppSelector } from '@store';
import { authorizedUserDefaultBalanceSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './wallet-statistic-counter.scss';

const t = translateByNamespace('client:wallet-page:wallet-statistic-counter');
const cn = classname('wallet-statistic-counter');

const COUNTER_COLOR = '#6ea2e7';
const PENDING_COUNTER_COLOR = '#e6a23c';

export const WalletStatisticCounter = () => {
    const defaultBalance = useAppSelector(authorizedUserDefaultBalanceSelector);

    const counters = useMemo(() => {
        if (!defaultBalance) {
            return;
        }

        const { displayedBalance, pendingDeposit, pendingWithdrawal } = defaultBalance;

        return {
            balance: displayedBalance.formatted ?? undefined,
            pendingDeposit: pendingDeposit.formatted ?? undefined,
            pendingWithdrawal: pendingWithdrawal.formatted ?? undefined,
        };
    }, [defaultBalance]);

    if (!counters) {
        return null;
    }

    const { balance, pendingDeposit, pendingWithdrawal } = counters;

    return (
        <div className={cn('')}>
            {balance && <StatisticCounter color={COUNTER_COLOR} counter={balance} title={t('total-balance')} />}
            {pendingDeposit && <StatisticCounter color={PENDING_COUNTER_COLOR} counter={pendingDeposit} title={t('pending-deposit')} />}
            {pendingWithdrawal && <StatisticCounter color={PENDING_COUNTER_COLOR} counter={pendingWithdrawal} title={t('pending-withdrawal')} />}
        </div>
    );
};
