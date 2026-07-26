import React from 'react';

import { classname } from '@utils';

import './statistic-card.scss';

const cn = classname('statistic-card');

type StatisticCardProps = {
    value: string | number;
    label: string;
};

export const StatisticCard = ({ value, label }: StatisticCardProps) => (
    <div className={cn('')}>
        <div className={cn('value')}>{value}</div>
        <div className={cn('label')}>{label}</div>
    </div>
);
