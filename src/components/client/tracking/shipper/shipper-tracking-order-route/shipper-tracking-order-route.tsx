import React from 'react';

import { Timeline, TimelineConnector, TimelineDot, TimelineIcon } from '@components';
import { FullTruckIcon } from '@icons';
import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { classname, translateByNamespace } from '@utils';

import { useShipperTrackingOrderRoute } from './use-shipper-tracking-order-route';

import './shipper-tracking-order-route.scss';

export type ShipperTrackingOrderRouteProps = {
    pickupInformation?: Partial<OrderPickupInformation>;
    deliveryInformation?: Partial<OrderDeliveryInformation>;
    showTruck?: boolean;
};

const cn = classname('shipper-tracking-order-route');
const t = translateByNamespace('client:loadboard:parsed-order-route');

export const ShipperTrackingOrderRoute = ({ pickupInformation, deliveryInformation, showTruck = false }: ShipperTrackingOrderRouteProps) => {
    const { pickupAddressLine, deliveryAddressLine } = useShipperTrackingOrderRoute({
        pickupInformation,
        deliveryInformation,
    });

    const { city: pickupCity } = pickupInformation || {};
    const { city: deliveryCity } = deliveryInformation || {};

    return (
        <div className={cn('')}>
            <div className={cn('info-block')}>
                <span className={cn('info-block-address')}>{pickupAddressLine}</span>
                <span className={cn('info-block-address')}>{deliveryAddressLine}</span>
            </div>
            <Timeline horizontal={true}>
                <TimelineDot view={showTruck ? 'primary' : 'gray'} withoutBackground={true} size='mini' />
                <div className={cn('route-details-wrapper')}>
                    <TimelineConnector className={cn('route-details-connector')}>
                        {showTruck && (
                            <>
                                <TimelineConnector className={cn('route-details-connector', { inner: true })} />
                                <TimelineIcon view='primary' Icon={FullTruckIcon} className={cn('route-details-icon')} />
                            </>
                        )}
                    </TimelineConnector>
                </div>
                <TimelineDot view='gray' withoutBackground={true} size='mini' />
            </Timeline>
            <div className={cn('info-block')}>
                <span className={cn('info-block-city')}>{pickupCity ?? t('no-city')}</span>
                <span className={cn('info-block-city')}>{deliveryCity ?? t('no-city')}</span>
            </div>
        </div>
    );
};
