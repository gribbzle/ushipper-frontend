import React, { useMemo } from 'react';
import { format } from 'date-fns';

import { StatisticCard } from '@/components/common/statistic-card/statistic-card';
import { Company } from '@store/admin';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './company-brief-statistics.scss';

const t = translateByNamespace('client:company-page:brief');
const cn = classname('company-brief-statistics');

type CompanyBriefStatisticsProps = {
    company: Company;
};

export const CompanyBriefStatistics = ({ company }: CompanyBriefStatisticsProps) => {
    const stats = useMemo(
        () => [
            {
                value: format(new Date(company.createdAt), 'MMM d, yyyy'),
                label: t('member-since-label'),
            },
        ],
        [company],
    );

    return <div className={cn('')}>{stats.map((stat, index) => stat.value && <StatisticCard key={index} value={stat.value} label={stat.label} />)}</div>;
};
