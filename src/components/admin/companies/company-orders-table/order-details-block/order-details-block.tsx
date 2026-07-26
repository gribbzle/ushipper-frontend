import React from 'react';

import { Load } from '@store/client';
import { classname, isFreightX, isUshipper, translateByNamespace } from '@utils';

import './order-details-block.scss';

const tProducts = translateByNamespace('client:loadboard:load-details');
const cn = classname('order-details-block');

export const OrderDetailsBlock = ({ order: { details, vehicles, commodities } }: { order: Load }) => (
    <div className={cn('')}>
        <span className={cn('order-id')}>{details.orderId}</span>
        {isFreightX && <span>{tProducts('commodity', { count: commodities.length })}</span>}
        {isUshipper && <span>{tProducts('vehicle', { count: vehicles.length })}</span>}
    </div>
);
