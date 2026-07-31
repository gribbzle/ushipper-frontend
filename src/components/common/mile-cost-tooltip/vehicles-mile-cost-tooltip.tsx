import React from 'react';

import { MileCostTooltipProps } from '@/components/common/mile-cost-tooltip/mile-cost-tooltip.types';
import { Tooltip } from '@/components/common/tooltip/tooltip';
import { TooltipContent } from '@/components/common/tooltip/tooltip';
import { TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { calculateTotalPayment, getPaymentPerDistanceDetails } from '@/utils/payment';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './mile-cost-tooltip.scss';

const cn = classname('mile-cost-tooltip');
const t = translateByNamespace('common:mile-cost');

type VehiclesMileCostTooltipProps = Omit<MileCostTooltipProps, 'commodities' | 'vehicles'> & { vehiclesCount: number };

export const VehiclesMileCostTooltip = ({ drivingDistance, paymentInformation, vehiclesCount, classNameTitle }: VehiclesMileCostTooltipProps) => {
    const { mileCostPerVehicle, mileCostPerOrder, mileCostPerVehicleWithMi } = getPaymentPerDistanceDetails(
        calculateTotalPayment(paymentInformation),
        drivingDistance,
        vehiclesCount,
    );

    return (
        <Tooltip>
            <TooltipTrigger asChild={true}>
                <span className={cn('title', [classNameTitle])}>{mileCostPerVehicleWithMi}</span>
            </TooltipTrigger>
            <TooltipContent className={cn('content')}>
                <span>
                    {t('mile-cost-per-vehicle')}: <strong>{mileCostPerVehicle}</strong>
                </span>
                <span>
                    {t('mile-cost-per-order')}: <strong>{mileCostPerOrder}</strong>
                </span>
            </TooltipContent>
        </Tooltip>
    );
};
