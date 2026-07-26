import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';

import { useAppSelector } from '@store';
import { orderCreateAtSelector, orderCreatorSelector } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import { OrderInfoDetailsWrapper } from '../order-info-details-wrapper';

import './order-created-info.scss';

const t = translateByNamespace('client:order:order-information');
const cn = classname('order-created-info');

export const OrderCreatedInfo = () => {
    const creator = useAppSelector(orderCreatorSelector);
    const createdAt = useAppSelector(orderCreateAtSelector);

    return (
        <OrderInfoDetailsWrapper title={t('order-created-at-title')}>
            <div className={cn()}>
                {createdAt && (
                    <div className={cn('value')}>
                        {t('order-created-at-label', {
                            date: formatInTimeZone(new Date(createdAt), 'America/Los_Angeles', 'MMMM d'),
                            time: formatInTimeZone(new Date(createdAt), 'America/Los_Angeles', 'hh:mm a'),
                        })}
                    </div>
                )}
                {creator && <div className={cn('value')}>{t('order-creator-label', { creatorName: creator.name })}</div>}
            </div>
        </OrderInfoDetailsWrapper>
    );
};
