import React, { useMemo } from 'react';

import useElementSize from '@/hooks/use-element-size';
import {
    Button,
    InfoTag,
    OrderChatDrawer,
    Paper,
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
} from '@components';
import { LineBrokenIcon } from '@icons';
import { classname, formatMetersToMiles, translateByNamespace } from '@utils';

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
