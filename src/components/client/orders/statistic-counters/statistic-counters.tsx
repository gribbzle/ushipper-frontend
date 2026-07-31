import React, { useCallback, useMemo } from 'react';
import { toCamelCase } from 'js-convert-case';

import { StatisticCounter } from '@/components/common/statistic-counter/statistic-counter';
import { OrderStatisticsGroup } from '@/enums';
import { StatisticsCounters } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateOrderStatisticsGroup, translateOrderStatisticsGroupTooltip } from '@utils/translate/order/translations';

import { ORDER_STATISTICS_GROUP_COLOR } from './constants';

import './statistic-counters.scss';

type StatisticCountersProps = {
    value?: string;
    onCounterClick: (value?: OrderStatisticsGroup) => void;
    statisticsCounters?: StatisticsCounters;
};

type StatisticCounterItem = {
    title: string;
    value: OrderStatisticsGroup;
    counter: string;
    tipText: string;
    color: string;
};

const cn = classname('statistic-counters');

export const StatisticCounters = ({ value, onCounterClick, statisticsCounters }: StatisticCountersProps) => {
    const counters = useMemo((): StatisticCounterItem[] | null => {
        if (!statisticsCounters) {
            return null;
        }

        return Object.values(OrderStatisticsGroup)
            .map(groupKey => {
                const counterValue = statisticsCounters.groupCounters[toCamelCase(groupKey)];

                return {
                    title: translateOrderStatisticsGroup(groupKey),
                    value: groupKey,
                    counter: String(counterValue),
                    tipText: translateOrderStatisticsGroupTooltip(groupKey),
                    color: ORDER_STATISTICS_GROUP_COLOR[groupKey],
                };
            })
            .filter(Boolean);
    }, [statisticsCounters]);

    const handleCounterClick = useCallback((value: OrderStatisticsGroup | undefined) => onCounterClick(value), [onCounterClick]);

    return (
        <div className={cn()}>
            {counters &&
                counters.map(item => (
                    <StatisticCounter<OrderStatisticsGroup> isSelected={item.value === value} onCounterClick={handleCounterClick} key={item.title} {...item} />
                ))}
        </div>
    );
};
