import React from 'react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { toKebabCase } from 'js-convert-case';

import { Timeline } from '@/components/common/timeline/timeline';
import { TimelineConnector } from '@/components/common/timeline/timeline-connector/timeline-connector';
import { TimelineContent } from '@/components/common/timeline/timeline-content/timeline-content';
import { TimelineDot } from '@/components/common/timeline/timeline-dot/timeline-dot';
import { TimelineItem } from '@/components/common/timeline/timeline-item/timeline-item';
import { TimelineSeparator } from '@/components/common/timeline/timeline-separator/timeline-separator';
import { OrderStatus } from '@/enums';
import { useAppSelector } from '@store';
import {
    orderBOLCreatedAtSelector,
    orderBOLOrderDeliveryInformationSelector,
    orderBOLOrderPickupInformationSelector,
    orderBOLOrderSelector,
} from '@store/client/order-BOL';
import { classname } from '@utils/classname';
import { getShortDate } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { translateOrderStatus } from '@utils/translate/order/get-order-status-translate';

import './activity.scss';

const cn = classname('activity');
const translateOrderBOLPage = translateByNamespace('client:order-BOL-page');

type Props = {
    className?: string;
};

export const Activity = ({ className }: Props) => {
    const pickupInformation = useAppSelector(orderBOLOrderPickupInformationSelector);
    const deliveryInformation = useAppSelector(orderBOLOrderDeliveryInformationSelector);
    const order = useAppSelector(orderBOLOrderSelector);
    const createdAt = useAppSelector(orderBOLCreatedAtSelector);

    const { scheduledPickupAt } = pickupInformation ?? {};
    const { scheduledDeliveryAt } = deliveryInformation ?? {};
    const { deliveredAt, pickedUpAt, acceptedAt, status } = order ?? {};

    return (
        <div className={cn('', [className])}>
            <Timeline>
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot view={status} />
                        <TimelineConnector view={status === OrderStatus.DELIVERED || status === OrderStatus.PICKED_UP ? status : 'default'} />
                    </TimelineSeparator>
                    <TimelineContent>
                        <span className={cn('order-status')}>{translateOrderStatus(OrderStatus.ACCEPTED)}</span>
                        {status === OrderStatus.NEW && createdAt && <span className={cn('date')}>{format(new Date(createdAt), 'MMM d, h:mm a zzz')}</span>}
                        {status === OrderStatus.ACCEPTED && acceptedAt && (
                            <span className={cn('date')}>{format(new Date(acceptedAt), 'MMM d, h:mm a zzz')}</span>
                        )}
                    </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineConnector view={status === OrderStatus.DELIVERED || status === OrderStatus.PICKED_UP ? status : 'default'} />
                        <TimelineDot view={status === OrderStatus.DELIVERED || status === OrderStatus.PICKED_UP ? status : 'default'} />
                        <TimelineConnector view={status === OrderStatus.DELIVERED ? 'success' : 'default'} />
                    </TimelineSeparator>
                    <TimelineContent>
                        <span className={cn('order-status')}>{translateOrderStatus(OrderStatus.PICKED_UP)}</span>
                        {scheduledPickupAt && (
                            <div className={cn('info-row')}>
                                <span className={cn('date')}>{getShortDate(scheduledPickupAt)}</span>
                                <span className={cn('additional-info')}>{translateOrderBOLPage('scheduled')}</span>
                            </div>
                        )}
                        {pickedUpAt && (
                            <div className={cn('info-row')}>
                                <span className={cn('date')}>{formatInTimeZone(new Date(pickedUpAt), 'America/Los_Angeles', 'MMM d, h:mm a zzz')}</span>
                                <span className={cn('additional-info')}>{translateOrderBOLPage(toKebabCase(OrderStatus.PICKED_UP))}</span>
                            </div>
                        )}
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem>
                    <TimelineSeparator>
                        <TimelineConnector view={status === OrderStatus.DELIVERED ? 'success' : 'default'} />
                        <TimelineDot view={status === OrderStatus.DELIVERED ? 'success' : 'default'} />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <span className={cn('order-status')}>{translateOrderStatus(OrderStatus.DELIVERED)}</span>
                        {scheduledDeliveryAt && (
                            <div className={cn('info-row')}>
                                <span className={cn('date')}>{getShortDate(scheduledDeliveryAt)}</span>
                                <span className={cn('additional-info')}>{translateOrderBOLPage('scheduled')}</span>
                            </div>
                        )}
                        {deliveredAt && (
                            <div className={cn('info-row')}>
                                <span className={cn('date')}>{formatInTimeZone(new Date(deliveredAt), 'America/Los_Angeles', 'MMM d, h:mm a zzz')}</span>
                                <span className={cn('additional-info')}>{translateOrderBOLPage(OrderStatus.DELIVERED)}</span>
                            </div>
                        )}
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        </div>
    );
};
