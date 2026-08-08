import React from 'react';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { getFullNameOfVehicle, getVehicleTypeTranslation } from '@/utils/vehicle';
import { OrderVehicle } from '@/shared/types';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import './order-item-vehicles-list.scss';

const t = translateByNamespace('client:order:vehicles:fields');
const cn = classname('vehicle-list');

type OrderItemVehiclesListProps = {
    vehicles: OrderVehicle[];
    hidePrice?: boolean;
    hideType?: boolean;
    hideVin?: boolean;
};

export const OrderItemVehiclesList = ({ vehicles, hidePrice, hideVin, hideType }: OrderItemVehiclesListProps) => (
    <div className={cn()}>
        {vehicles.map((vehicle, index) => (
            <div key={index} className={cn('vehicle')}>
                <span className={cn('vehicle-model')}>{getFullNameOfVehicle(vehicle)}</span>
                {!hideType && vehicle.type && (
                    <div className={cn('vehicle-group')}>
                        <span className={cn('vehicle-param')}>{t('type-label')}:</span>
                        <span className={cn('vehicle-value')}>{getVehicleTypeTranslation(vehicle)}</span>
                    </div>
                )}
                {!hideVin && vehicle.vin && (
                    <div className={cn('vehicle-group')}>
                        <span className={cn('vehicle-param')}>{t('vin-label')}:</span>
                        <span className={cn('vehicle-value')}>{vehicle.vin.toUpperCase()}</span>
                    </div>
                )}
                {!hidePrice && vehicle.price && <span className={cn('vehicle-price')}>{formatToCurrency(vehicle.price)}</span>}
                {vehicle.inop && <OrderTag view='inop'>{t('inop-label')}</OrderTag>}
                {vehicle.enclosed && <OrderTag view='enclosed'>{t('enclosed-label')}</OrderTag>}
            </div>
        ))}
    </div>
);
