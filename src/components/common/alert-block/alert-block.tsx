import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './alert-block.scss';

type Props = {
    children: ReactNode;
    view?: 'default' | 'warning' | 'danger' | 'success' | 'canceled' | 'disabled' | 'plain';
    className?: string;
};

const cn = classname('alert-block');

export const AlertBlock = ({ view, className, children }: Props) => (
    <div className={cn('', { view }, [className])}>
        <div className={cn('line')} />
        <div className={cn('content')}>{children}</div>
    </div>
);
