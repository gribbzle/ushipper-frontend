import React, { useMemo } from 'react';

import { BasketIcon, BoxIcon } from '@icons';
import { OrderCommodity } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { calculateTotalQuantitiesOfCommodities, calculateTotalWeightOfCommodities } from '@utils/commodity';
import { translateByNamespace } from '@utils/i18n';

import './commodities-total-info.scss';

type CommoditiesTotalInfoProps = {
    commodities: OrderCommodity[];
    isFull?: boolean;
    showLabel?: boolean;
    showIcon?: boolean;
};

const cn = classname('commodities-total-info');
const t = translateByNamespace('client:tracking-page:commodities-info');
const tNoDetails = translateByNamespace('client:tracking-page');
const tWeight = translateByNamespace('client:loadboard:load-details');

export const CommoditiesTotalInfo = ({ commodities, isFull = true, showLabel = true, showIcon = false }: CommoditiesTotalInfoProps) => {
    const weight = useMemo(() => calculateTotalWeightOfCommodities(commodities), [commodities]);
    const quantities = useMemo(() => calculateTotalQuantitiesOfCommodities(commodities), [commodities]);

    return (
        <>
            {showIcon && <BasketIcon />}
            {showLabel && <p className={cn('label')}>{t('total-weight')}</p>}
            <h4>{weight > 0 ? tWeight('about-weight', { weight: weight.toLocaleString('en-US') }) : tNoDetails('no-details')}</h4>
            {isFull && (
                <>
                    {showIcon && <BoxIcon />}
                    {showLabel && <p className={cn('label')}>{t('total-quantity')}</p>}
                    <h4>{quantities ? quantities : tNoDetails('no-details')}</h4>
                </>
            )}
        </>
    );
};
