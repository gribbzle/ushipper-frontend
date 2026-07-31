import React, { PropsWithChildren, ReactNode } from 'react';
import has from 'has-values';

import { classname } from '@utils/classname';

import './order-item-info-column.scss';

type OrderItemInfoColumnProps = {
    title: ReactNode;
    infoObject?: Record<string, string>;
    noDataText?: string;
};

const cn = classname('order-item-info-column');

type Props = PropsWithChildren<OrderItemInfoColumnProps> & {
    className?: string;
    titleClassName?: string;
};

export const OrderItemInfoColumn = ({ title, infoObject, noDataText, children, className, titleClassName }: Props) => {
    const hasInformation = has(infoObject);

    return (
        <div className={cn('', [className])}>
            {title && <div className={cn('title', [titleClassName])}>{title}</div>}
            {children ||
                (hasInformation && infoObject ? (
                    Object.values(infoObject).map((infoString, index) => <p key={`${infoString}-${index}`}>{infoString}</p>)
                ) : (
                    <p className={cn('no-data')}>{noDataText}</p>
                ))}
        </div>
    );
};
