import React from 'react';
import has from 'has-values';

import { getFullNameOfVehicle } from '@/utils/vehicle';
import { OrderVehicle } from '@/shared/types';
import { classname } from '@utils/classname';

import './offer-vehicles.scss';

type Props = {
    vehicles: OrderVehicle[];
    className?: string;
};

const cn = classname('offer-vehicles');

export const OfferVehicles = ({ vehicles, className }: Props) => {
    if (!has(vehicles)) {
        return null;
    }

    return (
        <div className={cn('vehicles', [className])}>
            {vehicles.map((vehicle, index) => (
                <div key={index}>
                    <div className={cn('vehicle-title')}>{getFullNameOfVehicle(vehicle)}</div>
                    {vehicle.vin && (
                        <div className={cn('vehicle-vin')}>
                            VIN #: <span>{vehicle.vin}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
