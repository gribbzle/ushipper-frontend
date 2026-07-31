import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { RouteItem } from '@/components/client/order-bols/order-bol-details/order-info/route-item/route-item';
import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { CommodityDetails } from '@/components/common/commodity/commodity-details/commodity-details';
import { Timeline } from '@/components/common/timeline/timeline';
import { TimelineConnector } from '@/components/common/timeline/timeline-connector/timeline-connector';
import { TimelineContent } from '@/components/common/timeline/timeline-content/timeline-content';
import { TimelineDot } from '@/components/common/timeline/timeline-dot/timeline-dot';
import { TimelineItem } from '@/components/common/timeline/timeline-item/timeline-item';
import { TimelineSeparator } from '@/components/common/timeline/timeline-separator/timeline-separator';
import { useAppSelector } from '@store';
import {
    orderBOLOrderCommoditiesSelector,
    orderBOLOrderDeliveryInformationSelector,
    orderBOLOrderDetailsSelector,
    orderBOLOrderPickupInformationSelector,
    orderBOLOrderStatusSelector,
    orderBOLOrderVehiclesSelector,
} from '@store/client/order-BOL';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';
import { translateOrderStatus } from '@utils/translate/order/get-order-status-translate';

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
