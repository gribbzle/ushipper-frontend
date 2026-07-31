import React from 'react';
import has from 'has-values';

import { CommodityDetails } from '@/components/common/commodity/commodity-details/commodity-details';
import { OrderCommodity } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './load-board-order-commodities-column.scss';

const cn = classname('load-board-order-commodities-column');
const loadBoardTranslate = translateByNamespace('client:loadboard:item');

type Props = {
    commodities: OrderCommodity[];
    onViewMoreClick: () => void;
};

export const LoadBoardOrderCommoditiesColumn = ({ commodities, onViewMoreClick }: Props) => (
    <div className={cn()}>
        {has(commodities) && (
            <>
                {commodities.slice(0, 1).map(commodity => (
                    <CommodityDetails commodity={commodity} key={commodity.publicId} />
                ))}
                {commodities.length > 1 && (
                    <button onClick={onViewMoreClick} className={cn('view-more')}>
                        {loadBoardTranslate('view-more', { counter: commodities.length - 1 })}
                    </button>
                )}
            </>
        )}
        {!has(commodities) && <span>{loadBoardTranslate('no-commodities')}</span>}
    </div>
);
