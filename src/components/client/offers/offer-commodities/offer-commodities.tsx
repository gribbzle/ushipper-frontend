import React from 'react';
import has from 'has-values';

import { CommodityDetails } from '@/components/common';
import { OrderCommodity } from '@store/api/orders-api';
import { classname } from '@utils';

import './offer-commodities.scss';

type Props = {
    commodities: OrderCommodity[];
    className?: string;
};

const cn = classname('offer-commodities');

export const OfferCommodities = ({ commodities, className }: Props) => {
    if (!has(commodities)) {
        return null;
    }

    return (
        <div className={cn('commodities', [className])}>
            {commodities.map(commodity => (
                <CommodityDetails commodity={commodity} key={commodity.publicId} inline={true} />
            ))}
        </div>
    );
};
