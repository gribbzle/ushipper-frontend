import React from 'react';

import { UserOrderStatus } from '@/enums';
import { classname } from '@utils';

import './parsed-order-status-block.scss';

const cn = classname('parsed-order-status-block');

export const ParsedOrderStatusBlock = ({ view, label }: { view: UserOrderStatus; label: string }) => (
    <div className={cn('', { view })}>
        {label.split('').map((char, index) => (
            <span key={index} className={cn('char')}>
                {char}
            </span>
        ))}
    </div>
);
