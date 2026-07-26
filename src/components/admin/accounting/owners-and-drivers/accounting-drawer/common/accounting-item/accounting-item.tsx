import React from 'react';

import { classname } from '@utils';

import { AccountingItemProps } from './accounting-item.types';

import './accounting-item.scss';

const cn = classname('accounting-item');

export const AccountingItem = ({ footer, header, body }: AccountingItemProps) => {
    return (
        <div className={cn()}>
            <div className={cn('content')}>
                <div className={cn('header')}>{header}</div>
                {body}
            </div>
            {footer && <div className={cn('footer')}>{footer}</div>}
        </div>
    );
};
