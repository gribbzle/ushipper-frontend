import React from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { OrderRoute } from '@/components/client/orders/order-route/order-route';
import { ViewOrderRouteButton } from '@/components/client/orders/view-order-route-button/view-order-route-button';
import { getDestination } from '@/utils/driving';
import { Load } from '@store/client';
import { translateByNamespace } from '@utils/i18n';

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
