import React, { ReactNode } from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './broker-details-block.scss';

const cn = classname('broker-details-block');
const t = translateByNamespace('client:loadboard:load-details');

export const BrokerDetailsBlock = ({ children }: { children: ReactNode }) => (
    <OrderItemInfoColumn title={t('broker')} className={cn('')}>
        {children}
    </OrderItemInfoColumn>
);
