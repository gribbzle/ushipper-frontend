import React from 'react';

import { classname } from '@utils';

import './order-tag.scss';

type OrderTagView = 'posted' | 'tagged' | 'source' | 'source-danger' | 'source-declined' | 'source-primary' | 'source-disabled';

type OrderTagProps = {
    children?: React.ReactNode;
    view: OrderTagView | string;
    size?: 'small' | 'medium' | string;
    isHover?: boolean;
};

const cn = classname('order-tag');

export const OrderTag = ({ view, children, size, isHover = false }: OrderTagProps) => {
    return <div className={cn('', { view, size, hover: isHover })}>{children}</div>;
};
