import React, { ReactNode } from 'react';

import { classname } from '@utils';

import './order-info-details-wrapper.scss';

const cn = classname('order-info-details-wrapper');

type Props = {
    children: ReactNode;
    title: string;
    className?: string;
};

export const OrderInfoDetailsWrapper = ({ children, title, className }: Props) => {
    return (
        <div className={cn('', [className])}>
            <div className={cn('header')}>{title}</div>
            <div className={cn('content')}>{children}</div>
        </div>
    );
};
