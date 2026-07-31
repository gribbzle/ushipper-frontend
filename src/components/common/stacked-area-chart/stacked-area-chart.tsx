import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { classname } from '@utils/classname';
import { getShortDate } from '@utils/dates';
import { formatToCurrency } from '@utils/numbers';

import './stacked-area-chart.scss';

export type ChartArea = {
    dataKey: string;
    color: string;
};

export type ChartData = { [key: string]: string | number };

type Props = {
    labelXAxis: string;
    labelYAxis: string;
    height: number;
    margins?: {
        top?: number;
        right?: number;
        left?: number;
        bottom?: number;
    };
    areas: ChartArea[];
    data: ChartData[];
    isLegendVisible?: boolean;
};

const cn = classname('stacked-area-chart');

const tickerFormatter = (value: any) => {
    const numbers = [
        { min: 1_000_000_000_000, label: 'T' },
        { min: 1_000_000_000, label: 'B' },
        { min: 1_000_000, label: 'M' },
        { min: 1_000, label: 'K' },
    ];

    const number = numbers.find(({ min }) => value > min);

    return number ? value / number.min + number.label : value;
};

export const StackedAreaChart = (props: Props) => {
    const { labelXAxis, labelYAxis, height, margins, areas, data, isLegendVisible = true } = props;

    return (
        <div className={cn()}>
            <div className={cn('label-x-axis-and-legend')}>
                <div className={cn('label-x-axis')}>{labelYAxis}</div>
                {isLegendVisible && (
                    <div className={cn('legend')}>
                        {areas.map(({ dataKey, color }) => (
                            <div key={dataKey}>
                                <span style={{ backgroundColor: color }}></span> {dataKey}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <ResponsiveContainer width='100%' height={height} className='stacked-area-chart'>
                <AreaChart data={data} margin={margins}>
                    <defs>
                        {areas.map(({ dataKey, color }, index) => (
                            <linearGradient key={dataKey} id={`color-${index}`} x1='1' y1='1' x2='0' y2='0'>
                                <stop offset='0%' stopColor={color} stopOpacity={0.6} />
                                <stop offset='100%' stopColor={color} stopOpacity={1} />
                            </linearGradient>
                        ))}
                    </defs>

                    <CartesianGrid strokeDasharray='12 6' strokeWidth={1} stroke='#E9EBF0' />
                    <XAxis dataKey='name' />
                    <YAxis tickFormatter={tickerFormatter} />
                    <Tooltip
                        content={({ payload, label }) => (
                            <div className={cn('tooltip')}>
                                {payload?.map(({ stroke, name, value }) => (
                                    <h4 key={name} style={{ color: stroke }}>
                                        {value ? formatToCurrency(value as number) : '$0'}
                                    </h4>
                                ))}
                                <p>{getShortDate(label)}</p>
                            </div>
                        )}
                    />
                    {areas.map(({ dataKey }, index) => (
                        <Area key={dataKey} dataKey={dataKey} type='monotone' stroke={`url(#color-${index})`} fill={`url(#color-${index})`} />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
            <div className={cn('label-y-axis')}>{labelXAxis}</div>
            <div></div>
        </div>
    );
};
