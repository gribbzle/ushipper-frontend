import React, { useMemo } from 'react';

import { OrderChatDrawer } from '@/components/client/orders/drawers/order-chat-drawer/order-chat-drawer';
import { Button } from '@/components/common/button/button';
import { InfoTag } from '@/components/common/info-tag/info-tag';
import { Timeline } from '@/components/common/timeline/timeline';
import { TimelineConnector } from '@/components/common/timeline/timeline-connector/timeline-connector';
import { TimelineContent } from '@/components/common/timeline/timeline-content/timeline-content';
import { TimelineDot } from '@/components/common/timeline/timeline-dot/timeline-dot';
import { TimelineItem } from '@/components/common/timeline/timeline-item/timeline-item';
import { TimelineSeparator } from '@/components/common/timeline/timeline-separator/timeline-separator';
import { Paper } from '@/components/common/paper/paper';
import useElementSize from '@/hooks/use-element-size';
import { LineBrokenIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatMetersToMiles } from '@utils/numbers';

import { OrderDeliveryInformationBlock } from './order-delivery-information-block';
import { OrderMapBlock } from './order-map-block';
import { OrderPickupInformationBlock } from './order-pickup-information-block';
import { useOrderPickupAndDeliveryPaper } from './use-order-pickup-and-delivery-paper';

import './order-pickup-and-delivery-paper.scss';

const cn = classname('pickup-delivery-information-paper');
const t = translateByNamespace('client:order:show-page');

const TimelineBlock = () => (
    <Paper
        body={
            <Timeline>
                <TimelineItem size='mini'>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot borderColor='#e6a23c' />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <OrderPickupInformationBlock />
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem size='mini'>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot borderColor='#67c23a' />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <OrderDeliveryInformationBlock />
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
        }
    />
);

const OFFSET_WIDTH = 0;
const OFFSET_HEIGHT = 54;

export const OrderPickupAndDeliveryPaper = ({ isLoading }: { isLoading: boolean }) => {
    const { drivingDistance, chatId, handleOpenOrderChatDrawer, badgeText } = useOrderPickupAndDeliveryPaper();
    const { elementRef, size } = useElementSize(OFFSET_WIDTH, OFFSET_HEIGHT);

    const header = useMemo(() => {
        return drivingDistance ? (
            <InfoTag view='default'>
                <LineBrokenIcon /> {formatMetersToMiles(drivingDistance)}
            </InfoTag>
        ) : null;
    }, [drivingDistance]);

    return (
        <Paper
            className={cn()}
            title={t('pickup-and-delivery-information-header')}
            header={header}
            bodyClassName={cn('body')}
            body={
                <div className={cn('wrapper')} style={{ height: size.height }}>
                    <OrderMapBlock />
                    {chatId && (
                        <Button view='segmented' onClick={handleOpenOrderChatDrawer} badgeText={badgeText}>
                            {t('chat-open-btn-title')}
                        </Button>
                    )}
                    <div ref={elementRef} className={cn('content')}>
                        {!isLoading && <TimelineBlock />}
                    </div>

                    <OrderChatDrawer />
                </div>
            }
        />
    );
};
