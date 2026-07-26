import React, { MouseEvent, useCallback, useMemo, useState } from 'react';
import { toKebabCase } from 'js-convert-case';
import Link from 'next/link';

import { Button, Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@/components/common';
import { getOrderDeliveryAddress, getOrderPickupAddress, hasOrderDeliveryAddress, hasOrderPickupAddress } from '@/utils/order';
import { getPaymentMethodTranslate } from '@/utils/payment';
import { useDriverTrackingMap, useMeShipper, useOrderTracking, useTracking, useUserTracking } from '@hooks';
import { useAppDispatch } from '@store';
import { chatsActions, openChatByOrderIdAction } from '@store/common';
import { CheckIsOutdated, classname, formatMetersToMiles, formatToCurrency, getShortDate, translateByNamespace, translateOrderStatus } from '@utils';

import { OrderTag } from '../../orders';

import './driver-order.scss';

const cn = classname('order-container');

const translateTrackingPage = translateByNamespace('client:tracking-page');

export const DriverOrder = () => {
    const { user: driver } = useUserTracking();
    const order = useOrderTracking();
    const dispatch = useAppDispatch();
    const isShipper = useMeShipper();
    const [hoveredColor, setHoveredColor] = useState<string>();
    const { fitBoundsToOrderRoute } = useTracking();

    const {
        setConfig,
        config: { order: selectedOrder },
    } = useDriverTrackingMap();

    const handleMessageButton = useCallback(
        (e: MouseEvent<HTMLButtonElement>): void => {
            e.stopPropagation();
            let orderId = order.publicId;

            if (isShipper && order.shipperOrder?.publicId) {
                orderId = order.shipperOrder.publicId;
            }
            dispatch(openChatByOrderIdAction(orderId)).then(() => {
                dispatch(
                    chatsActions.setIsDrawerOpen({
                        isDrawerOpen: true,
                        needToReset: false,
                        setSelectedAtTop: true,
                    }),
                );
            });
        },
        [dispatch, order, isShipper],
    );

    const handleViewRouteButton = useCallback((): void => {
        fitBoundsToOrderRoute(driver, order);
        setConfig({ driver, order, displayDriverLocation: true, displayOrderRoute: true });
    }, [setConfig, driver, order, fitBoundsToOrderRoute]);

    const driverPay = useMemo(() => order.paymentInformation.driverPay, [order]);
    const drivingDistance = useMemo(() => order.drivingDistance, [order]);
    const scheduledPickupDate = useMemo(() => order.pickupInformation.scheduledPickupAt, [order]);

    const isPickupOutdated = useMemo(
        (): boolean | null => (scheduledPickupDate ? CheckIsOutdated(scheduledPickupDate, order.pickedUpAt) : false),
        [scheduledPickupDate, order],
    );

    const handleMouseEnter = () => {
        setHoveredColor(order.color);
    };

    const handleMouseLeave = () => {
        setHoveredColor(undefined);
    };

    const handleClick = useCallback(
        (e: MouseEvent<HTMLDivElement>): void => {
            e.stopPropagation();
            handleViewRouteButton();
        },
        [handleViewRouteButton],
    );

    let orderStatus = order.status;

    if (isShipper && order.shipperOrder?.status) {
        orderStatus = order.shipperOrder.status;
    }

    return (
        <div
            className={cn('')}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            style={{ borderColor: selectedOrder?.publicId === order.publicId ? order.color : hoveredColor ? hoveredColor : '' }}
        >
            <div className={cn('order-info')}>
                <div className={cn('order-info-ellipse')} style={{ backgroundColor: order.color }} />
                {order.details.orderId && (
                    <Link
                        href={`/orders/${order.publicId}`}
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        target='_blank'
                        className={cn('order-id')}
                    >
                        {translateTrackingPage('order-id', { orderId: order.details.orderId })}
                    </Link>
                )}
                {driverPay && (
                    <span className={cn('payment-information')}>
                        {formatToCurrency(driverPay)}
                        {order.paymentInformation.method && ` (${getPaymentMethodTranslate(order.paymentInformation.method)})`}
                    </span>
                )}
                <OrderTag view={toKebabCase(orderStatus)}>{translateOrderStatus(orderStatus)}</OrderTag>
            </div>
            <Timeline>
                <TimelineItem size='mini'>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot view='warning' borderColor={order.color} />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        {hasOrderPickupAddress(order.pickupInformation) && (
                            <span className={cn('address')}>{getOrderPickupAddress(order.pickupInformation)}</span>
                        )}
                        {order.pickupInformation.scheduledPickupAt && (
                            <>
                                <div className={cn('ellipse')} />
                                <span className={cn('date', { danger: isPickupOutdated ?? false })}>
                                    {getShortDate(order.pickupInformation.scheduledPickupAt)}
                                </span>
                            </>
                        )}
                    </TimelineContent>
                </TimelineItem>
                <TimelineItem size='mini'>
                    <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot view='success' borderColor={order.color} />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        {hasOrderDeliveryAddress(order.deliveryInformation) && (
                            <span className={cn('address')}>{getOrderDeliveryAddress(order.deliveryInformation)}</span>
                        )}
                        {order.deliveryInformation.scheduledDeliveryAt && (
                            <>
                                <div className={cn('ellipse')} />
                                <span className={cn('date')}>{getShortDate(order.deliveryInformation.scheduledDeliveryAt)}</span>
                            </>
                        )}
                    </TimelineContent>
                </TimelineItem>
            </Timeline>
            <div className={cn('order-buttons')}>
                <Button size='mini' onClick={handleViewRouteButton}>
                    {translateTrackingPage('view-route', { distance: formatMetersToMiles(drivingDistance ?? 0) })}
                </Button>
                <Button onClick={handleMessageButton} size='mini'>
                    {translateTrackingPage('message')}
                </Button>
            </div>
        </div>
    );
};
