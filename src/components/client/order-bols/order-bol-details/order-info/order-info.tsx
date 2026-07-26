import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { RouteItem } from '@/components/client/order-bols/order-bol-details/order-info/route-item/route-item';
import { CommodityDetails, OrderTag, Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@components';
import { useAppSelector } from '@store';
import {
    orderBOLOrderCommoditiesSelector,
    orderBOLOrderDeliveryInformationSelector,
    orderBOLOrderDetailsSelector,
    orderBOLOrderPickupInformationSelector,
    orderBOLOrderStatusSelector,
    orderBOLOrderVehiclesSelector,
} from '@store/client/order-BOL';
import { classname, renderProjectSpecificComponent, translateByNamespace, translateOrderStatus } from '@utils';

import './order-info.scss';

const cn = classname('order-info');
const t = translateByNamespace('client:order-BOL-page:order');

type Props = {
    className?: string;
};

export const OrderInfo = ({ className }: Props) => {
    const details = useAppSelector(orderBOLOrderDetailsSelector);
    const pickupInformation = useAppSelector(orderBOLOrderPickupInformationSelector);
    const deliveryInformation = useAppSelector(orderBOLOrderDeliveryInformationSelector);
    const vehicles = useAppSelector(orderBOLOrderVehiclesSelector);
    const commodities = useAppSelector(orderBOLOrderCommoditiesSelector);

    const status = useAppSelector(orderBOLOrderStatusSelector);

    const header = useMemo(
        () => (
            <div className={cn('header')}>
                {details?.orderId && <span className={cn('order-id')}>{t('order-id', { id: details.orderId })}</span>}
                {status && <OrderTag view={toKebabCase(status)}>{translateOrderStatus(status)}</OrderTag>}
            </div>
        ),
        [details?.orderId, status],
    );

    const route = useMemo(
        () => (
            <Timeline>
                {pickupInformation && (
                    <TimelineItem size='mini'>
                        <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot view='primary' withoutBackground={true} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <RouteItem data={pickupInformation} />
                        </TimelineContent>
                    </TimelineItem>
                )}

                {deliveryInformation && (
                    <TimelineItem size='mini'>
                        <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot view='success' withoutBackground={true} />
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <RouteItem data={deliveryInformation} />
                        </TimelineContent>
                    </TimelineItem>
                )}
            </Timeline>
        ),
        [deliveryInformation, pickupInformation],
    );

    return (
        <div className={cn('', [className])}>
            {header}
            {(pickupInformation?.scheduledPickupAt || deliveryInformation?.scheduledDeliveryAt) && route}
            {renderProjectSpecificComponent(
                {
                    OrderBolVehiclesDetails:
                        vehicles && vehicles.length > 0 ? (
                            <div className={cn('vehicles')}>
                                {vehicles.map(vehicle => (
                                    <span key={vehicle.id}>{[vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(' ')}</span>
                                ))}
                            </div>
                        ) : (
                            <></>
                        ),
                    OrderBolCommoditiesDetails:
                        commodities && commodities.length > 0 ? (
                            <div className={cn('commodities')}>
                                {commodities.map(commodity => (
                                    <CommodityDetails commodity={commodity} key={commodity.publicId} />
                                ))}
                            </div>
                        ) : (
                            <></>
                        ),
                },
                'orderBolProductsDetails',
            )}
        </div>
    );
};
