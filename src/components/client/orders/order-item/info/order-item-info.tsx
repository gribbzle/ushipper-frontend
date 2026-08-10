import React, { useMemo } from 'react';
import has from 'has-values';
import { toKebabCase } from 'js-convert-case';

import { OrderStatus } from '@/enums/order-status';
import { getOrderInformation } from '@/utils/order';
import { OrderInformation } from '@store/client';
import { classname } from '@utils/classname';

import './order-item-info.scss';

const cn = classname('order-item-info');

type Props = {
    title: string;
    emptyText: string;
    fields: OrderInformation;
    status?: OrderStatus;
    pickedUpAt?: string | null;
    deliveredAt?: string | null;
    pickedUpAtTimezone?: string | null;
    deliveredAtTimezone?: string | null;
};

export const OrderItemInfo = ({ title, fields, emptyText, status, pickedUpAt, deliveredAt, pickedUpAtTimezone, deliveredAtTimezone }: Props) => {
    const information = useMemo(
        () => getOrderInformation({ information: fields, status, pickedUpAt, deliveredAt, pickedUpAtTimezone, deliveredAtTimezone }),
        [fields, status, pickedUpAt, deliveredAt, deliveredAtTimezone, pickedUpAtTimezone],
    );

    return (
        <div className={cn()}>
            {title && <div className={cn('title')}>{title}</div>}
            {has(information) &&
                Object.keys(information).map((key, index) => {
                    const infoKey = key as keyof typeof information;

                    return (
                        <div key={index} className={cn(toKebabCase(infoKey))}>
                            {information[infoKey]}
                        </div>
                    );
                })}
            {!has(information) && <span className={cn('empty-text')}>{emptyText}</span>}
        </div>
    );
};
