import React from 'react';
import has from 'has-values';

import { VehicleEnclosedTag } from '@/components/common/vehicle-enclosed-tag/vehicle-enclosed-tag';
import { VehicleInopTag } from '@/components/common/vehicle-inop-tag/vehicle-inop-tag';
import { getFullNameOfVehicle, getVehicleTypeTranslation } from '@/utils/vehicle';
import { OrderVehicle } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { VehicleSizesInfo } from '../../common/vehicle-sizes-info';

import './load-board-order-vehicles-column.scss';

const cn = classname('load-board-order-vehicles-column');
const vehicleTranslate = translateByNamespace('common:vehicle');
const loadBoardTranslate = translateByNamespace('client:loadboard:item');

type Props = {
    vehicles: OrderVehicle[];
    onViewMoreClick: () => void;
};

export const LoadBoardOrderVehiclesColumn = ({ vehicles, onViewMoreClick }: Props) => (
    <div className={cn()}>
        {has(vehicles) && (
            <>
                {vehicles.slice(0, 2).map((vehicle, index) => (
                    <div key={index} className={cn('vehicle')}>
                        <span className={cn('vehicle-model')}>{getFullNameOfVehicle(vehicle)}</span>
                        <VehicleSizesInfo vehicle={vehicle} />
                        <div className={cn('row')}>
                            <span className={cn('vehicle-type')}>{getVehicleTypeTranslation(vehicle)}</span>
                            <VehicleInopTag inop={vehicle.inop} />
                            <VehicleEnclosedTag enclosed={vehicle.enclosed} />
                        </div>
                    </div>
                ))}
                {vehicles.length > 2 && (
                    <button onClick={onViewMoreClick} className={cn('view-more')}>
                        {vehicleTranslate('view-more', { counter: vehicles.length - 2 })}
                    </button>
                )}
            </>
        )}
        {!has(vehicles) && <span>{loadBoardTranslate('no-vehicles')}</span>}
    </div>
);
