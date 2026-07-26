import React from 'react';

import { OrderCommodity, OrderVehicle } from '@store/api/orders-api';
import { OrderPaymentInformation } from '@store/client';
import { renderProjectSpecificComponent } from '@utils';

import { CommoditiesMileCostTooltip } from './commodities-mile-cost-tooltip';
import { VehiclesMileCostTooltip } from './vehicles-mile-cost-tooltip';

export type MileCostTooltipProps = {
    drivingDistance?: number;
    paymentInformation: OrderPaymentInformation;
    vehicles?: OrderVehicle[];
    commodities?: OrderCommodity[];
    classNameTitle?: string;
};

export const MileCostTooltip = ({ drivingDistance, paymentInformation, vehicles = [], commodities = [], classNameTitle }: MileCostTooltipProps) => {
    if (!drivingDistance) {
        return null;
    }

    return renderProjectSpecificComponent(
        {
            VehiclesMileCostTooltip: (
                <VehiclesMileCostTooltip
                    drivingDistance={drivingDistance}
                    paymentInformation={paymentInformation}
                    vehiclesCount={vehicles.length}
                    classNameTitle={classNameTitle}
                />
            ),
            CommoditiesMileCostTooltip: (
                <CommoditiesMileCostTooltip
                    drivingDistance={drivingDistance}
                    paymentInformation={paymentInformation}
                    commoditiesCount={commodities.length}
                    classNameTitle={classNameTitle}
                />
            ),
        },
        'orderProductsMileCostTooltip',
    );
};
