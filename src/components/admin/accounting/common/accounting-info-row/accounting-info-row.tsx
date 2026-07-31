import React from 'react';

import { classname } from '@utils/classname';

import './accounting-info-row.scss';

const cn = classname('accounting-info-row');

export const AccountingInfoRow = ({ title, value }: { title: string; value: string }) => (
    <div className={cn('row')}>
        <span className={cn('key')}>{title}:</span>
        <span className={cn('value')}>{value}</span>
    </div>
);
