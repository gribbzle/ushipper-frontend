import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';

import { Timeline } from '@/components/common/timeline/timeline';
import { TimelineConnector } from '@/components/common/timeline/timeline-connector/timeline-connector';
import { TimelineContent } from '@/components/common/timeline/timeline-content/timeline-content';
import { TimelineDot } from '@/components/common/timeline/timeline-dot/timeline-dot';
import { TimelineItem } from '@/components/common/timeline/timeline-item/timeline-item';
import { TimelineSeparator } from '@/components/common/timeline/timeline-separator/timeline-separator';
import { Ellipse } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './request-dates.scss';

const cn = classname('request-dates');
const t = translateByNamespace('client:requests-page:drawer:request-item');

type Props = {
    requestPickupDate: string;
    requestDeliveryDate: string;
    orderPickupDate: string | null;
    orderDeliveryDate: string | null;
};

export const RequestDates = ({ requestPickupDate, requestDeliveryDate, orderPickupDate, orderDeliveryDate }: Props) => {
    const warning = useCallback((date1: string, date2: string) => format(new Date(date1), 'MMM dd') !== format(new Date(date2), 'MMM dd'), []);

    const pickupWarning = useMemo(() => orderPickupDate !== null && warning(requestPickupDate, orderPickupDate), [orderPickupDate, requestPickupDate, warning]);

    const deliveryWarning = useMemo(
        () => orderDeliveryDate !== null && warning(requestDeliveryDate, orderDeliveryDate),
        [orderDeliveryDate, requestDeliveryDate, warning],
    );

    return (
        <Timeline className={cn('')}>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot view='primary' withoutBackground={true} size='mini' />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <span className={cn('route-date', { warning: pickupWarning })}>{format(new Date(requestPickupDate), 'MMM dd')}</span>
                    <Ellipse width={4} height={4} />
                    <span className={cn('type')}>{t('pdate')}</span>
                </TimelineContent>
            </TimelineItem>
            <TimelineItem>
                <TimelineSeparator>
                    <TimelineConnector />
                    <TimelineDot view='success' withoutBackground={true} size='mini' />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <span className={cn('route-date', { warning: deliveryWarning })}>{format(new Date(requestDeliveryDate), 'MMM dd')}</span>
                    <Ellipse width={4} height={4} />
                    <span className={cn('type')}>{t('ddate')}</span>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    );
};
