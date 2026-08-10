import React from 'react';

import { CommodityDetails } from '@/components/common/commodity/commodity-details/commodity-details';
import { OrderCommodity } from '@store/api/orders-api';
import { classname } from '@utils/classname';

import './order-item-commodities-list.scss';

const cn = classname('order-item-commodities-list');

type OrderItemCommoditiesListProps = {
    commodities: OrderCommodity[];
};

export const OrderItemCommoditiesList = ({ commodities }: OrderItemCommoditiesListProps) => (
    <div className={cn()}>
        {commodities.map(commodity => (
            <CommodityDetails commodity={commodity} key={commodity.publicId} inline={true} />
        ))}
    </div>
);
