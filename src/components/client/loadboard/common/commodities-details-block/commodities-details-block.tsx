import React, { useMemo } from 'react';
import has from 'has-values';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { CommodityDetails } from '@/components/common/commodity/commodity-details/commodity-details';
import { OrderCommodity } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { calculateTotalQuantitiesOfCommodities, calculateTotalWeightOfCommodities } from '@utils/commodity';
import { translateByNamespace } from '@utils/i18n';

import './commodities-details-block.scss';

const cn = classname('commodities-details-block');
const t = translateByNamespace('client:loadboard:load-details');

export const CommoditiesDetailsBlock = ({ commodities }: { commodities: OrderCommodity[] }) => {
    const weight = useMemo(() => calculateTotalWeightOfCommodities(commodities), [commodities]);
    const quantities = useMemo(() => calculateTotalQuantitiesOfCommodities(commodities), [commodities]);

    return has(commodities) ? (
        <OrderItemInfoColumn title={t('commodity', { count: commodities.length })}>
            <div className={cn('')}>
                {commodities.map(commodity => (
                    <CommodityDetails commodity={commodity} key={commodity.publicId} />
                ))}
                {commodities.length > 1 && (
                    <>
                        {weight > 0 && (
                            <span className={cn('total')}>
                                {t('total-weight')}: <span className={cn('total-value')}>{t('about-weight', { weight: weight.toLocaleString('en-US') })}</span>
                            </span>
                        )}
                        {!!quantities && (
                            <span className={cn('total')}>
                                {t('total-quantity')}: <span className={cn('total-value')}>{quantities}</span>
                            </span>
                        )}
                    </>
                )}
            </div>
        </OrderItemInfoColumn>
    ) : null;
};
