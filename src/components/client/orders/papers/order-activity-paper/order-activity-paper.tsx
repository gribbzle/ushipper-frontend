import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toKebabCase } from 'js-convert-case';
import has from 'has-values';
import { useRouter } from 'next/router';

import { OrderActivityDetailsDrawer } from '@/components/client/orders/drawers/order-activity-details-drawer/order-activity-details-drawer';
import { Avatar } from '@/components/common/avatar/avatar';
import { Button } from '@/components/common/button/button';
import { Timeline } from '@/components/common/timeline/timeline';
import { TimelineConnector } from '@/components/common/timeline/timeline-connector/timeline-connector';
import { TimelineContent } from '@/components/common/timeline/timeline-content/timeline-content';
import { TimelineDot } from '@/components/common/timeline/timeline-dot/timeline-dot';
import { TimelineItem } from '@/components/common/timeline/timeline-item/timeline-item';
import { TimelineSeparator } from '@/components/common/timeline/timeline-separator/timeline-separator';
import { Paper } from '@/components/common/paper/paper';
import { HistoryItemEventName } from '@/enums/history-item-event-name';
import { useAppDispatch } from '@store';
import { FundsTransferPayload, OrderActivity, orderActivityApi, useGetOrderActivityQuery } from '@store/api/order-activity-api';
import { ordersActions } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateActivityFundsTransferStatus } from '@utils/translate/order/funds-transfer-status-translations';

import './order-activity-paper.scss';
import ArrowDownIcon from '@/assets/icons/arrow-down.svg';
import SystemIcon from '@/assets/icons/system-icon.svg';

const cn = classname('order-activity-timeline');
const t = translateByNamespace('client:order:activity');

const getActivityTranslationKey = (eventName: HistoryItemEventName): string => `statuses.${toKebabCase(eventName)}`;

const getActivityTranslationParams = (activity: OrderActivity) => {
    const { eventName, payload } = activity;

    switch (eventName) {
        case HistoryItemEventName.ORDER_FUNDS_TRANSFER_STATUS_CHANGED:
            return { new: translateActivityFundsTransferStatus((payload as FundsTransferPayload).new) };

        default:
            return payload;
    }
};

export const OrderActivityPaper = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [cursor, setCursor] = useState<string | undefined>();
    const orderId = router.query['order-id'] as string;

    const { data: response } = useGetOrderActivityQuery({ orderId, cursor }, { skip: !has(orderId) });

    const handleShowMoreClick = useCallback(() => setCursor(response?.nextCursor || undefined), [response?.nextCursor]);

    const handleOpenActivityDetailsDrawerClick = useCallback(
        ({ details, createdAt, creatorName }: { details: object; creatorName: string; createdAt: string }) =>
            dispatch(ordersActions.setOrderActivityDetailsDrawerProps({ isVisible: true, details, createdAt, creatorName })),
        [dispatch],
    );

    const handleActivityClick = useCallback(
        (activity: OrderActivity) => {
            const handlers: Partial<Record<HistoryItemEventName, (() => void) | undefined>> = {
                [HistoryItemEventName.ORDER_UPDATED]: () =>
                    handleOpenActivityDetailsDrawerClick({
                        details: activity.payload,
                        creatorName: activity.creator?.name ?? t('system-name'),
                        createdAt: activity.createdAt,
                    }),
            };

            return handlers[activity.eventName];
        },
        [handleOpenActivityDetailsDrawerClick],
    );

    useEffect(() => {
        return () => {
            orderActivityApi.util.invalidateTags([{ type: 'Orders', id: `Activity-${orderId}` }]);
        };
    }, [orderId]);

    const body = useMemo(
        () => (
            <div className={cn()}>
                {has(response?.activities) ? (
                    <>
                        <OrderActivityDetailsDrawer />
                        <Timeline>
                            {response?.activities.map((activity, index) => {
                                const translationKey = getActivityTranslationKey(activity.eventName);
                                const translationParams = getActivityTranslationParams(activity);
                                const onClick = handleActivityClick(activity);

                                return (
                                    <TimelineItem key={index}>
                                        <TimelineSeparator>
                                            <TimelineConnector />
                                            <TimelineDot view={activity.eventName} />
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <p className={cn('event', { hover: !!onClick })} onClick={onClick}>
                                                {t(translationKey, { ...translationParams })}
                                            </p>
                                            <div>
                                                {activity.creator?.avatar && <Avatar src={activity.creator.avatar.url} size='mini' />}
                                                {!activity.creator && <SystemIcon className={cn('system-icon')} />}
                                                <div>
                                                    <p>
                                                        {activity.creator?.name ?? t('system-name')}{' '}
                                                        {activity.creator?.nickname && ` (${activity.creator?.nickname})`}
                                                    </p>
                                                    <p>{format(new Date(activity.createdAt), 'dd MMM yyyy, HH:mm')}</p>
                                                </div>
                                            </div>
                                        </TimelineContent>
                                    </TimelineItem>
                                );
                            })}
                        </Timeline>
                        {response?.nextCursor && (
                            <Button view='link' active={true} size='mini' onClick={handleShowMoreClick}>
                                <ArrowDownIcon /> {t('show-more-btn-label')}
                            </Button>
                        )}
                    </>
                ) : (
                    <div className={cn('empty-label')}>{t('no-activity-placeholder')}</div>
                )}
            </div>
        ),
        [handleActivityClick, handleShowMoreClick, response?.activities, response?.nextCursor],
    );

    return <Paper className='no-print order-activity-paper' title={t('header')} body={body} />;
};
