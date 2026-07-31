import React, { useCallback, useMemo } from 'react';

import { StatisticCounter } from '@/components/common/statistic-counter';
import { useQueryFilters } from '@hooks';
import { useGetBalanceStatisticQuery } from '@store/api/balance-statistic-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './accounts-balance-statistic-counters.scss';

type AccountsBalanceStatisticCountersFiltersState = {
    amountType?: 'negative' | 'positive';
};

const POSITIVE_BALANCES_COLOR = '#67c23a';
const NEGATIVE_BALANCES_COLOR = '#eb5757';

const t = translateByNamespace('admin:accounting');
const cn = classname('accounts-balance-statistic-counters');

export const AccountsBalanceStatisticCounters = ({ accountRole }: { accountRole: 'administrator' | 'owner' | 'driver' | 'dispatcher' }) => {
    const { data } = useGetBalanceStatisticQuery({ accountRole });
    const {
        setFilters,
        filters: { amountType },
    } = useQueryFilters<AccountsBalanceStatisticCountersFiltersState>();

    const handleFilterChange = useCallback(
        (value: 'negative' | 'positive') => {
            const isSameFilter = amountType === value;

            setFilters({ amountType: isSameFilter ? undefined : value, page: 1 });
        },
        [setFilters, amountType],
    );
    const counters = useMemo(() => {
        if (!data) {
            return;
        }

        const { positiveAmount, negativeAmount } = data;

        return {
            positiveBalances: positiveAmount.formatted ?? undefined,
            negativeBalances: negativeAmount.formatted ?? undefined,
        };
    }, [data]);

    if (!counters) {
        return null;
    }

    const { positiveBalances, negativeBalances } = counters;

    return (
        <div className={cn()}>
            {positiveBalances && (
                <StatisticCounter
                    color={POSITIVE_BALANCES_COLOR}
                    isSelected={amountType === 'positive'}
                    onCounterClick={() => handleFilterChange('positive')}
                    counter={positiveBalances}
                    title={t('positive-balances')}
                    value={amountType}
                />
            )}
            {negativeBalances && (
                <StatisticCounter
                    isSelected={amountType === 'negative'}
                    onCounterClick={() => handleFilterChange('negative')}
                    color={NEGATIVE_BALANCES_COLOR}
                    counter={negativeBalances}
                    title={t('negative-balances')}
                    value={amountType}
                />
            )}
        </div>
    );
};
