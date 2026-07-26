import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './item-field.scss';

const cn = classname('item-field');

type ItemFieldProps = { value: string; icon: ReactNode };

export const ItemField = ({ value, icon }: ItemFieldProps) => (
    <div className={cn('')}>
        <div className={cn('icon')}>{icon}</div>
        <div className={cn('value')}>{value}</div>
    </div>
);
