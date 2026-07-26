import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { OrderStatus } from '@/enums';
import { OrderTag } from '@components';
import { Load } from '@store/client';
import { classname, diffForHumans, translateByNamespace, translateOrderStatus } from '@utils';

import { OrderInfoDetailsWrapper } from '../order-info-details-wrapper';

import './order-status-info.scss';

const t = translateByNamespace('client:order:order-information');
const cn = classname('order-status-info');

type Props = {
    order: Load;
};

const statusTimeMap = {
    [OrderStatus.NEW]: 'createdAt',
    [OrderStatus.ACCEPTED]: 'acceptedAt',
    [OrderStatus.PICKED_UP]: 'pickedUpAt',
    [OrderStatus.DELIVERED]: 'deliveredAt',
    [OrderStatus.POSTED]: 'postedAt',
    [OrderStatus.ON_HOLD]: 'default',
    [OrderStatus.CANCELED]: 'default',
    [OrderStatus.DECLINED]: 'default',
    [OrderStatus.PENDING]: 'default',
};

export const OrderStatusInfo = ({ order }: Props) => {
    const time = useMemo(() => {
        const timeKey = statusTimeMap[order.status];

        if (timeKey === 'default') {
            return null;
        }

        const time = order[timeKey as keyof Load];

        if (time === null || typeof time === 'string') {
            return time;
        }

        return null;
    }, [order]);

    return (
        <OrderInfoDetailsWrapper title={t('order-status-title')}>
            <div className={cn('')}>
                <div className={cn('status')}>
                    <OrderTag view={toKebabCase(order.status)}>{translateOrderStatus(order.status)}</OrderTag>

                    {time && <span className={cn('time')}> {diffForHumans(new Date(time), true)}</span>}
                </div>
            </div>
        </OrderInfoDetailsWrapper>
    );
};
