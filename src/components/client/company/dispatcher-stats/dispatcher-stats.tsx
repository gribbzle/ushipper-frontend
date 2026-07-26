import React from 'react';
import { format } from 'date-fns';

import { StatisticCard } from '@/components/common';
import { AuthorizedUserInfo } from '@store/global/types';
import { classname, formatToCurrency, numberWithCommas, translateByNamespace } from '@utils';

import './dispatcher-stats.scss';

const cn = classname('dispatcher-stats');
const t = translateByNamespace('client:company-page');

export const DispatcherStats = ({ user }: { user: AuthorizedUserInfo }) => {
    return (
        <div className={cn('')}>
            <StatisticCard label={t('dispatcher-page.orders-dispatched')} value={numberWithCommas(user.dispatchedLoadsCount)} />
            <StatisticCard label={t('dispatcher-page.avg-mile')} value={formatToCurrency(user.avgMileCost)} />
            <StatisticCard label={t('dispatcher-page.member-since')} value={format(new Date(user.createdAt), 'MMM d, yyyy')} />
        </div>
    );
};
