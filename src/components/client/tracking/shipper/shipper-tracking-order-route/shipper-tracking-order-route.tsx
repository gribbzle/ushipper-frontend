import React from 'react';

import { Timeline } from '@/components/common/timeline/timeline';
import { TimelineConnector } from '@/components/common/timeline/timeline-connector/timeline-connector';
import { TimelineDot } from '@/components/common/timeline/timeline-dot/timeline-dot';
import { TimelineIcon } from '@/components/common/timeline/timeline-icon/timeline-icon';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { ShipperTrackingOrderRouteProps } from './shipper-tracking-order-route.types';
import { useShipperTrackingOrderRoute } from './use-shipper-tracking-order-route';

import './shipper-tracking-order-route.scss';
import FullTruckIcon from '@/assets/icons/full-truck.svg';

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
