import React from 'react';

import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

import { CommoditiesMileCostTooltip } from './commodities-mile-cost-tooltip';
import { MileCostTooltipProps } from './mile-cost-tooltip.types';
import { VehiclesMileCostTooltip } from './vehicles-mile-cost-tooltip';

export { MileCostTooltipProps };

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
