import React from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { getDestination } from '@/utils/driving';
import { OrderRoute, ViewOrderRouteButton } from '@components';
import { Load } from '@store/client';
import { translateByNamespace } from '@utils';

import './order-route-details.scss';

const t = translateByNamespace('client:loadboard:load-details');

export const OrderRouteDetails = ({ order }: { order: Load }) => {
    const { pickupInformation, deliveryInformation, drivingDistance } = order;

    return (
        <OrderItemInfoColumn title={t('route')}>
            <OrderRoute inline={true} pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} enableAddressLinks={true} />
            <ViewOrderRouteButton
                pickupInformation={pickupInformation}
                deliveryInformation={deliveryInformation}
                label={t('view-route-in-google-btn', { distance: getDestination(drivingDistance, true) })}
            />
        </OrderItemInfoColumn>
    );
};
