import React, { useCallback } from 'react';

import { Paper } from '@/components/common/paper/paper';
import { getFullNameOfVehicle } from '@/utils/vehicle';
import { useAppSelector } from '@store';
import { OrderBOLVehicle } from '@store/api/order-bol-api';
import { orderBOLOrderVehiclesSelector } from '@store/client/order-BOL';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { OrderBolInspections } from './order-bol-inspections';

import './order-bol-vehicles-inspections.scss';

const cn = classname('order-bol-vehicle-inspections');
const t = translateByNamespace('client:order-BOL-page');

export const OrderBolVehiclesInspections = () => {
    const vehicles = useAppSelector(orderBOLOrderVehiclesSelector);

    const header = useCallback(
        (vehicle: OrderBOLVehicle) => (
            <>
                <span className={cn('vehicle-name')}>{getFullNameOfVehicle(vehicle)}</span>
                {vehicle.vin && <span className={cn('vin')}>{t('vin', { vin: vehicle.vin })}</span>}
            </>
        ),
        [],
    );

    return (
        <>
            {vehicles?.map(vehicle => (
                <Paper key={vehicle.id} className={cn()} header={header(vehicle)} body={<OrderBolInspections vehicle={vehicle} />} />
            ))}
        </>
    );
};
