import React, { useCallback, useMemo } from 'react';

import { Button } from '@/components/common/button/button';
import { getDestination } from '@/utils/driving';
import { getOrderDeliveryAddress, getOrderPickupAddress, hasAddress } from '@/utils/order';
import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './view-order-route-button.scss';

const t = translateByNamespace('common:order');
const cn = classname('view-order-route-button');

type Props = {
    pickupInformation: OrderPickupInformation;
    deliveryInformation: OrderDeliveryInformation;
    drivingDistance?: number;
    label?: string;
};

export const ViewOrderRouteButton = ({ pickupInformation, deliveryInformation, drivingDistance, label }: Props) => {
    const pickupAddress = useMemo(() => getOrderPickupAddress(pickupInformation), [pickupInformation]);
    const deliveryAddress = useMemo(() => getOrderDeliveryAddress(deliveryInformation), [deliveryInformation]);

    const openGoogleMap = useCallback(() => {
        window.open(`https://www.google.com/maps/dir/${encodeURIComponent(pickupAddress)}/${encodeURIComponent(deliveryAddress)}`, '_blank');
    }, [deliveryAddress, pickupAddress]);

    if (!hasAddress(pickupInformation) || !hasAddress(deliveryInformation)) {
        return null;
    }

    return (
        <Button size='mini' onClick={openGoogleMap} className={cn()}>
            {label ?? t('view-route', { distance: getDestination(drivingDistance ?? 0, true) })}
        </Button>
    );
};
