import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';

import { Timeline } from '@/components/common/timeline/timeline';
import { TimelineConnector } from '@/components/common/timeline/timeline-connector/timeline-connector';
import { TimelineContent } from '@/components/common/timeline/timeline-content/timeline-content';
import { TimelineDot } from '@/components/common/timeline/timeline-dot/timeline-dot';
import { TimelineItem } from '@/components/common/timeline/timeline-item/timeline-item';
import { TimelineSeparator } from '@/components/common/timeline/timeline-separator/timeline-separator';
import { getOrderDeliveryAddress, getOrderPickupAddress } from '@/utils/order';
import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { classname } from '@utils/classname';

import './order-route.scss';

const cn = classname('order-route');

type Props = {
    pickupInformation?: OrderPickupInformation;
    deliveryInformation?: OrderDeliveryInformation;
    inline?: boolean;
    enableAddressLinks?: boolean;
};

export const OrderRoute = ({ pickupInformation, deliveryInformation, inline = false, enableAddressLinks = false }: Props) => {
    const pickupAddress = useMemo(() => pickupInformation && getOrderPickupAddress(pickupInformation), [pickupInformation]);
    const deliveryAddress = useMemo(() => deliveryInformation && getOrderDeliveryAddress(deliveryInformation), [deliveryInformation]);

    const openGoogleMap = useCallback(
        (search?: string) => {
            if (search && enableAddressLinks) {
                window.open(`https://www.google.com/maps/dir/${encodeURIComponent(search)}}`, '_blank');
            }
        },
        [enableAddressLinks],
    );

    const titleClassName = useMemo(() => `${enableAddressLinks ? cn('link', ['route-title']) : 'route-title'}`, [enableAddressLinks]);

    if (!pickupAddress && !deliveryAddress) {
        return null;
    }

    return (
        <Timeline className={cn('', { inline })}>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot view='primary' withoutBackground={true} size='mini' />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <span className={titleClassName} onClick={() => openGoogleMap(pickupAddress)}>
                        {pickupAddress}
                    </span>
                    {inline && pickupInformation?.scheduledPickupAt && <span className={cn('ellipse')}></span>}
                    {pickupInformation?.scheduledPickupAt && (
                        <span className='route-date'>{format(new Date(pickupInformation?.scheduledPickupAt), 'MMM dd')}</span>
                    )}
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot view='success' withoutBackground={true} size='mini' />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <span className={titleClassName} onClick={() => openGoogleMap(deliveryAddress)}>
                        {deliveryAddress}
                    </span>
                    {inline && deliveryInformation?.scheduledDeliveryAt && <span className={cn('ellipse')}></span>}
                    {deliveryInformation?.scheduledDeliveryAt && (
                        <span className='route-date'>{format(new Date(deliveryInformation?.scheduledDeliveryAt), 'MMM dd')}</span>
                    )}
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    );
};
