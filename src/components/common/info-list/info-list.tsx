import React, { ReactNode } from 'react';

import { OrderItemInfoColumn } from '@/components/client';
import { classname } from '@utils';

import './info-list.scss';

const cn = classname('info-list');

export const InfoList = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <OrderItemInfoColumn titleClassName={cn('title')} title={title}>
            {children}
        </OrderItemInfoColumn>
    );
};
