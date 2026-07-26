import React from 'react';
import { format } from 'date-fns';

import { classname } from '@utils';

import { HelperText } from '../helper-text';

import './transaction-time-info-block.scss';

const cn = classname('transaction-time-info-block');

export const TransactionTimeInfoBlock = ({ time, id }: { time: string; id: string }) => (
    <div className={cn()}>
        <p>{format(new Date(time), 'dd.MM.yyyy HH:mm') ?? '—'}</p>
        <HelperText text={id} />
    </div>
);
