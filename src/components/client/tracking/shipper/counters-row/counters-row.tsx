import React, { ReactNode } from 'react';

import { classname, translateByNamespace } from '@utils';

import './counters-row.scss';

type CounterData = {
    title: string;
    value: ReactNode | null;
};

type CountersRowProps = {
    counters: CounterData[];
    defaultValue?: string | number;
};

const cn = classname('counters-row');
const tNoDetails = translateByNamespace('client:tracking-page');

export const CountersRow = ({ counters, defaultValue = tNoDetails('no-details') }: CountersRowProps) => {
    return (
        <div className={cn('')}>
            {counters.map((counter, index) => (
                <div key={index} className={cn('column')}>
                    <h4>{counter.title}</h4>
                    <p>{counter.value ?? defaultValue}</p>
                </div>
            ))}
        </div>
    );
};
