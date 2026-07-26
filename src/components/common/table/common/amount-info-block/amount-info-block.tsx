import React from 'react';

import { classname, formatToCurrency } from '@utils';

import './amount-info-block.scss';

type AmountInfoBlockProps = {
    value: number;
    disabled?: boolean;
    includePlus?: boolean;
    warning?: boolean;
    view?: 'light' | 'bold';
};

const cn = classname('amount-info-block');

export const AmountInfoBlock = ({ value, disabled = false, warning = false, includePlus = false, view = 'bold' }: AmountInfoBlockProps) => (
    <span className={cn('', { expense: value < 0 && !disabled && !warning, income: value >= 0 && !disabled && !warning, warning: warning, view })}>
        {!disabled && value > 0 && '+'}
        {includePlus && disabled && value > 0 && '+'}
        {formatToCurrency(value / 100)}
    </span>
);
