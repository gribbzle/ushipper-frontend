import { useMemo } from 'react';

import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { translateByNamespace } from '@utils';

import { ShipperTrackingOrderRouteProps } from './shipper-tracking-order-route';

const t = translateByNamespace('client:loadboard:parsed-order-route');

const formatAddressLine = (addressInfo?: Partial<OrderDeliveryInformation> | Partial<OrderPickupInformation>) =>
    [addressInfo?.state && `${addressInfo.state}`, addressInfo?.zip && `${addressInfo.zip}`].filter(Boolean).join(' ');

export const useShipperTrackingOrderRoute = ({
    pickupInformation,
    deliveryInformation,
}: Pick<ShipperTrackingOrderRouteProps, 'pickupInformation' | 'deliveryInformation'>) => {
    const deliveryAddressLine = useMemo(() => formatAddressLine(deliveryInformation) || t('no-zip'), [deliveryInformation]);
    const pickupAddressLine = useMemo(() => formatAddressLine(pickupInformation) || t('no-zip'), [pickupInformation]);

    return { pickupAddressLine, deliveryAddressLine };
};
