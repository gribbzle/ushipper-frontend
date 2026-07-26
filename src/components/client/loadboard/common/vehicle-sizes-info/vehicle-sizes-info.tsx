import React, { Fragment, useMemo } from 'react';
import has from 'has-values';

import { getSizesOfVehicle } from '@/utils/vehicle';
import { OrderVehicle } from '@store/api/orders-api';
import { classname, translateByNamespace } from '@utils';

import './vehicle-sizes-info.scss';

const cn = classname('vehicle-sizes-info');
const t = translateByNamespace('client:loadboard:load-details');

export const VehicleSizesInfo = ({ vehicle, isFull = true }: { vehicle: OrderVehicle; isFull?: boolean }) => {
    const sizes = useMemo(() => getSizesOfVehicle(vehicle), [vehicle]);
    const { weight } = vehicle;

    if (!has(sizes)) {
        return null;
    }

    return (
        <div className={cn('')}>
            <div className={cn('details')}>
                {Object.values(sizes).map((value, index) => (
                    <Fragment key={index}>
                        {index > 0 && <span className={cn('ellipse')}></span>}
                        <span className={cn('size')}>{value}</span>
                    </Fragment>
                ))}
            </div>
            {isFull && !!weight && <span className={cn('size', [cn('size-weight')])}>{t('about-weight', { weight: weight.toLocaleString('en-US') })}</span>}
        </div>
    );
};
