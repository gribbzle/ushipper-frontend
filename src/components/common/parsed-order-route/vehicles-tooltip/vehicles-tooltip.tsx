import React, { ReactNode } from 'react';

import { VehicleSizesInfo } from '@/components/client/loadboard/common/vehicle-sizes-info';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components';
import { CarIcon2 } from '@icons';
import { OrderVehicle } from '@store/api/orders-api';
import { classname, translateByNamespace } from '@utils';

import { ParsedOrderRouteProps } from '../parsed-order-route.types';

import { getVehicleLabel, useVehiclesTooltip } from './use-vehicles-tooltip';

import './vehicles-tooltip.scss';

const cn = classname('vehicles-tooltip');
const t = translateByNamespace('client:loadboard:load-details');

type VehicleInfoProps = {
    value?: boolean;
    disabled?: boolean;
    primary?: boolean;
    children: ReactNode;
    vehicle?: OrderVehicle | string;
};

const VehicleInfo = ({
    vehicles,
    vehicle,
    value = false,
    disabled = false,
    primary = false,
    children,
}: VehicleInfoProps & Pick<ParsedOrderRouteProps, 'vehicles'>) => {
    const { handleClick } = useVehiclesTooltip(vehicles);

    return (
        <div
            className={cn('vehicle', {
                value,
                disabled,
                primary,
            })}
            onClick={e => handleClick(e, vehicle)}
        >
            {children}
        </div>
    );
};

export const VehiclesTooltip = ({ vehicles, className }: Pick<ParsedOrderRouteProps, 'vehicles'> & { className: string }) => {
    const { vehicleInfo } = useVehiclesTooltip(vehicles);

    return (
        <Tooltip hideDelay={300}>
            <TooltipTrigger asChild={true}>
                <div className={cn('', [className])}>
                    <div className={cn('car-icon-container')}>
                        <CarIcon2 />
                    </div>
                    <VehicleInfo vehicles={vehicles} value={vehicles.length === 1} disabled={!vehicleInfo}>
                        {vehicles.length === 0 && t('no-vehicle')}
                        {vehicles.length > 1 && t('vehicle', { count: vehicles.length })}
                        {vehicleInfo}
                    </VehicleInfo>
                </div>
            </TooltipTrigger>
            {!!vehicles.length && (
                <TooltipContent className={cn('content')}>
                    {vehicleInfo && (
                        <div>
                            <VehicleInfo vehicles={vehicles} value={true} primary={true}>
                                {vehicleInfo}
                            </VehicleInfo>
                            {typeof vehicles[0] === 'object' && <VehicleSizesInfo vehicle={vehicles[0]} isFull={false} />}
                        </div>
                    )}
                    {vehicles.length > 1 &&
                        vehicles.map((vehicle, index) => (
                            <div key={index}>
                                <VehicleInfo vehicles={vehicles} vehicle={vehicle} value={true} primary={true}>
                                    {getVehicleLabel(vehicle)}
                                </VehicleInfo>
                                {typeof vehicle === 'object' && <VehicleSizesInfo vehicle={vehicle} isFull={false} />}
                            </div>
                        ))}
                </TooltipContent>
            )}
        </Tooltip>
    );
};
