import React, { useMemo } from 'react';
import has from 'has-values';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { getFullNameOfVehicle } from '@/utils/vehicle';
import { OrderVehicle } from '@/shared/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { VehicleSizesInfo } from '../vehicle-sizes-info';

import './vehicles-details-block.scss';

const cn = classname('vehicles-details-block');
const t = translateByNamespace('client:loadboard:load-details');

const calculateTotalWeight = (vehicles: OrderVehicle[]): number => vehicles.reduce((total, vehicle) => total + (vehicle.weight ?? 0), 0);

export const VehiclesDetailsBlock = ({ vehicles }: { vehicles: OrderVehicle[] }) => {
    const weight = useMemo(() => calculateTotalWeight(vehicles), [vehicles]);

    return has(vehicles) ? (
        <OrderItemInfoColumn title={t('vehicle', { count: vehicles.length })}>
            <div className={cn('')}>
                {vehicles.map(vehicle => {
                    const details = getFullNameOfVehicle(vehicle);

                    return (
                        <div key={vehicle.id}>
                            <span
                                className={cn('vehicle')}
                                onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${details} Dimensions`)}`, '_blank')}
                            >
                                {details}
                            </span>
                            <VehicleSizesInfo vehicle={vehicle} />
                        </div>
                    );
                })}
                {weight > 0 && vehicles.length > 1 && (
                    <span className={cn('weight')}>
                        {t('total-max-weight')}: <span className={cn('weight-value')}>{t('about-weight', { weight: weight.toLocaleString('en-US') })}</span>
                    </span>
                )}
            </div>
        </OrderItemInfoColumn>
    ) : null;
};
