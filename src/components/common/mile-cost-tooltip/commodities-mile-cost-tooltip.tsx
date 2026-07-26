import React from 'react';

import { MileCostTooltipProps, Tooltip, TooltipContent, TooltipTrigger } from '@/components/common';
import { calculateTotalPayment, getPaymentPerDistanceDetails } from '@/utils/payment';
import { classname, translateByNamespace } from '@utils';

import './mile-cost-tooltip.scss';

const cn = classname('mile-cost-tooltip');
const t = translateByNamespace('common:mile-cost');

type CommoditiesMileCostTooltipProps = Omit<MileCostTooltipProps, 'commodities' | 'vehicles'> & { commoditiesCount: number };

export const CommoditiesMileCostTooltip = ({ drivingDistance, paymentInformation, commoditiesCount, classNameTitle }: CommoditiesMileCostTooltipProps) => {
    const { mileCostPerOrder, mileCostPerOrderWithMi } = getPaymentPerDistanceDetails(
        calculateTotalPayment(paymentInformation),
        drivingDistance,
        commoditiesCount,
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild={true}>
                <span className={cn('title', [classNameTitle])}>{mileCostPerOrderWithMi}</span>
            </TooltipTrigger>
            <TooltipContent className={cn('content')}>
                <span>
                    {t('mile-cost-per-order')}: <strong>{mileCostPerOrder}</strong>
                </span>
            </TooltipContent>
        </Tooltip>
    );
};
