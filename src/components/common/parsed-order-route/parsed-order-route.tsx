import React from 'react';
import { formatInTimeZone } from 'date-fns-tz';

import { TransportTypeEnum } from '@/enums';
import { OrderTag, Timeline, TimelineArrow, TimelineDot } from '@components';
import { LineBrokenIcon } from '@icons';
import { useAppSelector } from '@store';
import { loadboardListSelector } from '@store/client/loadboard';
import { classname, formatMetersToMiles, isUshipper, translateByNamespace } from '@utils';

import { DistanceDirectionInfo } from './distance-direction-info';
import { ParsedOrderRouteProps } from './parsed-order-route.types';
import { useParsedOrderRoute } from './use-parsed-order-route';
import { VehiclesTooltip } from './vehicles-tooltip';

import './parsed-order-route.scss';

const cn = classname('parsed-order-route');
const tVehicle = translateByNamespace('common:vehicle');
const t = translateByNamespace('client:loadboard:parsed-order-route');

export const ParsedOrderRoute = ({
    pickupInformation,
    deliveryInformation,
    vehicles,
    drivingDistance,
    reverse = false,
    hasInopVehicles,
    trailerType,
    hideDirectionDistance = true,
}: ParsedOrderRouteProps) => {
    const { pickupAddressLine, deliveryAddressLine, pickupCoords, deliveryCoords } = useParsedOrderRoute({
        pickupInformation,
        deliveryInformation,
    });

    const { city: pickupCity, scheduledPickupAt } = pickupInformation || {};
    const { city: deliveryCity, scheduledDeliveryAt } = deliveryInformation || {};

    const { filters } = useAppSelector(loadboardListSelector);

    return (
        <div className={cn('wrapper')}>
            <div className={cn('')}>
                <div className={cn('info-block')}>
                    <span className='route-city'>{pickupCity ?? t('no-city')}</span>
                    <span className='route-address'>{pickupAddressLine}</span>
                    {scheduledPickupAt && <span className='route-date'>{formatInTimeZone(new Date(scheduledPickupAt), 'UTC', 'MMM dd')}</span>}
                </div>
                <div className={cn('timeline-wrapper')}>
                    <Timeline horizontal={true}>
                        <TimelineDot view='warning' withoutBackground={true} size='mini' />
                        <div className={cn('route-details-wrapper', { reverse, center: hasInopVehicles || !!trailerType })}>
                            <span className='route-details'>
                                {drivingDistance && (
                                    <>
                                        <div className={cn('route-icon-container')}>
                                            <LineBrokenIcon />{' '}
                                        </div>{' '}
                                        {formatMetersToMiles(drivingDistance)}
                                    </>
                                )}
                            </span>
                            <TimelineArrow />

                            {isUshipper && (
                                <div className={cn('vehicles')}>
                                    <VehiclesTooltip vehicles={vehicles} className='route-details' />
                                    {(hasInopVehicles || trailerType) && (
                                        <div className={cn('row')}>
                                            {hasInopVehicles && <OrderTag view='danger'>{tVehicle('inop')}</OrderTag>}
                                            {trailerType === TransportTypeEnum.Enclosed && <OrderTag view='inop'>{trailerType}</OrderTag>}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <TimelineDot view='success' withoutBackground={true} size='mini' />
                    </Timeline>
                </div>

                <div className={cn('info-block', { delivery: true })}>
                    <span className='route-city'>{deliveryCity ?? t('no-city')}</span>
                    <span className='route-address'>{deliveryAddressLine}</span>
                    {scheduledDeliveryAt && <span className='route-date'>{formatInTimeZone(new Date(scheduledDeliveryAt), 'UTC', 'MMM dd')}</span>}
                </div>
            </div>
            {!hideDirectionDistance && (
                <div className={cn('distance-wrapper')}>
                    <DistanceDirectionInfo className={cn('distance-wrapper-pickup')} data={pickupCoords} searchCoords={filters.origins} />
                    <DistanceDirectionInfo className={cn('distance-wrapper-delivery')} data={deliveryCoords} searchCoords={filters.destinations} />
                </div>
            )}
        </div>
    );
};
