import React from 'react';

import { LoadBoardFilters } from '@store/api/loadboard-api';
import { Load } from '@store/client';
import { classname } from '@utils/classname';

import { BrokerDetails } from './broker-details';
import { OrderDetails } from './order-details';

import './parsed-order-details.scss';

const cn = classname('parsed-order-details');

export const ParsedOrderDetails = ({ order, loadBoardFilters }: { order: Load; loadBoardFilters?: LoadBoardFilters }) => {
    return (
        <div className={cn('')}>
            <OrderDetails order={order} />
            <BrokerDetails loadBoardFilters={loadBoardFilters} order={order} />
        </div>
    );
};
