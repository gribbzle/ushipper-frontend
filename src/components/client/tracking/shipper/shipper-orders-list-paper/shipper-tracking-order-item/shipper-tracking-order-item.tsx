import React, { MouseEvent, useCallback, useMemo } from 'react';
import { format } from 'date-fns';

import { GenericButton } from '@/components/common/generic-button/generic-button';
import { Loader } from '@/components/common/loader/loader';
import { Paper } from '@/components/common/paper/paper';
import { TrackingOrderStatus } from '@/enums/tracking/tracking-order-status-enum';
import { formatDrivingDistance } from '@/utils/driving';
import { getOrderId } from '@/utils/order';
import { calculateTotalPayment, getPaymentPerDistance } from '@/utils/payment';
import { useDeliveryMetrics } from '@/hooks/tracking/use-delivery-metrics';
import { useAppDispatch, useAppSelector } from '@store';
import { selectedShipperTrackingOrderSelector, ShipperTrackingOrder, trackingActions, User } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { isFreightX, isUshipper } from '@utils/project-config';
import { isTrackingOrderNotDispatched, isTrackingOrderPickedUp } from '@utils/tracking/shipper-tracking-order-helpers';
import { getFormattedAverageSpeed, getFormattedDeliveryTime, getTrackingDriverAverageSpeed } from '@utils/tracking/tracking-driver-helpers';

import { ActiveRequests } from '../../active-requests';
import { CommoditiesTotalInfo } from '../../commodities-total-info';
import { CountersRow } from '../../counters-row';
import { ManagerInfo } from '../../manager-info';
import { ShipperTrackingOrderRoute } from '../../shipper-tracking-order-route';
import { ShipperOrderTag } from '../../shipper-tracking-order-tag';
import { TrackingDriverInfo } from '../../tracking-driver-info';

import './shipper-tracking-order-item.scss';
import HorizontalDotsIcon from '@/assets/icons/horizontal-dots.svg';

type ShipperTrackingOrderItemProps = {
    order: ShipperTrackingOrder;
    title: string;
    view: TrackingOrderStatus;
};

const cn = classname('shipper-tracking-order-item');
const t = translateByNamespace('client:tracking-page:shipper-orders-list-paper');
const tNoDetails = translateByNamespace('client:tracking-page');
const counterT = translateByNamespace('client:tracking-page:counters');

const DriverDetails = ({ driver, order }: { driver: User; order: ShipperTrackingOrder }) => {
    const { companyName, name, rating, avatar, isFlagged } = driver;
    const averageSpeed = getTrackingDriverAverageSpeed(driver);

    const { totalTime, loading } = useDeliveryMetrics({
        order,
        latestLocation: driver?.latestLocation,
        averageSpeed,
    });

    const countersData = [
        {
            title: counterT('average-speed'),
            value: getFormattedAverageSpeed(averageSpeed),
        },
        {
            title: counterT('total-miles'),
            value: loading ? <Loader /> : formatDrivingDistance(order.drivingDistance),
        },
        {
            title: counterT('delivery'),
            value: loading ? <Loader /> : getFormattedDeliveryTime(totalTime),
        },
    ];

    return (
        <div className={cn('footer', { column: true })}>
            <TrackingDriverInfo
                orderPublicId={order.publicId}
                userName={name}
                companyName={companyName}
                rating={rating}
                avatar={avatar}
                showLike={isFlagged}
                inline={true}
            />
            <CountersRow counters={countersData} />
        </div>
    );
};

export const ShipperTrackingOrderItem = ({ order, title, view }: ShipperTrackingOrderItemProps) => {
    const { publicId, dispatcher, pickupInformation, deliveryInformation, paymentInformation, vehicles, commodities, drivingDistance, driver } = order;
    const dispatch = useAppDispatch();
    const selectedOrder = useAppSelector(selectedShipperTrackingOrderSelector);
    const isDetailsVisible = selectedOrder?.publicId === order.publicId;
    const isOrderNotDispatched = isTrackingOrderNotDispatched(order);
    const isOrderPickedUp = isTrackingOrderPickedUp(order);

    const toggleDetailsVisible = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();

            const newSelectedOrder = isDetailsVisible ? null : order;

            dispatch(trackingActions.setSelectedShipperTrackingOrder(newSelectedOrder));
            dispatch(trackingActions.setSelectedActiveRequest(null));
            dispatch(trackingActions.setSelectedDriverId(order.driver?.publicId ?? null));
        },
        [dispatch, isDetailsVisible, order],
    );

    const handleOrderDetailsClick = useCallback(() => {
        if (publicId) {
            window.open(`/orders/${publicId}`, '_blank');
        }
    }, [publicId]);

    const scheduledPickupAt = useMemo(
        () => (pickupInformation?.scheduledPickupAt ? format(new Date(pickupInformation.scheduledPickupAt), 'MMM dd') : tNoDetails('no-details')),
        [pickupInformation],
    );
    const scheduledDeliveryAt = useMemo(
        () => (deliveryInformation?.scheduledDeliveryAt ? format(new Date(deliveryInformation.scheduledDeliveryAt), 'MMM dd') : tNoDetails('no-details')),
        [deliveryInformation],
    );

    const body = useMemo(
        () => (
            <div className={cn('')}>
                <div className={cn('title')}>
                    <p>
                        {t('order-id')}: {getOrderId(order)}
                    </p>
                    <ShipperOrderTag view={view}>{title}</ShipperOrderTag>
                </div>
                {isDetailsVisible && isOrderNotDispatched && <ActiveRequests order={order} />}
                <ShipperTrackingOrderRoute pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} showTruck={isOrderPickedUp} />
                {isDetailsVisible && (
                    <>
                        <div className={cn('details')}>
                            <div className={cn('value', { column: true, start: true })}>
                                <p className={cn('label')}>{t('delivery-terms')}</p>
                                <h4>
                                    {pickupInformation?.scheduledPickupAt || deliveryInformation?.scheduledDeliveryAt ? (
                                        <>
                                            {scheduledPickupAt} - {scheduledDeliveryAt}
                                        </>
                                    ) : (
                                        tNoDetails('no-details')
                                    )}
                                </h4>
                            </div>
                            <div className={cn('value', { column: true })}>
                                {isFreightX && <CommoditiesTotalInfo commodities={commodities} isFull={false} />}
                                {isUshipper && (
                                    <>
                                        <p className={cn('label')}> {t('vehicles')}</p>
                                        <h4>{vehicles?.length ?? 0}</h4>
                                    </>
                                )}
                            </div>
                            <div className={cn('value', { column: true })}>
                                <p className={cn('label')}> {t('cost-per-mile')}</p>
                                <h4>
                                    {drivingDistance
                                        ? getPaymentPerDistance(calculateTotalPayment(paymentInformation), drivingDistance)
                                        : tNoDetails('no-details')}
                                </h4>
                            </div>
                        </div>
                        <div className={cn('details')}>
                            <span className={cn('details-price')}>{formatToCurrency(calculateTotalPayment(paymentInformation))}</span>
                            <div className={cn('details-actions')}>
                                <GenericButton
                                    view='primary'
                                    figure='circle'
                                    size='large'
                                    onClick={e => {
                                        e?.stopPropagation();

                                        handleOrderDetailsClick();
                                    }}
                                >
                                    <HorizontalDotsIcon />
                                </GenericButton>
                            </div>
                        </div>
                    </>
                )}
            </div>
        ),
        [
            order,
            view,
            title,
            isDetailsVisible,
            isOrderNotDispatched,
            pickupInformation,
            deliveryInformation,
            isOrderPickedUp,
            scheduledPickupAt,
            scheduledDeliveryAt,
            commodities,
            vehicles?.length,
            drivingDistance,
            paymentInformation,
            handleOrderDetailsClick,
        ],
    );

    const footer = useMemo(() => {
        if (!isDetailsVisible) {
            return null;
        }

        if (isOrderNotDispatched) {
            if (!dispatcher) {
                return null;
            }

            const { avatar, nickname, name } = dispatcher;

            return (
                <div className={cn('footer')}>
                    <ManagerInfo name={name} nickName={nickname} avatarUrl={avatar?.url} />
                    <span className={cn('label')}>{t('manager')}</span>
                </div>
            );
        }

        if (!driver) {
            return null;
        }

        return <DriverDetails order={order} driver={driver} />;
    }, [isDetailsVisible, isOrderNotDispatched, driver, order, dispatcher]);

    return (
        <div onClick={e => toggleDetailsVisible(e)} className={cn('wrapper', { focus: isDetailsVisible })}>
            <Paper body={body} footer={footer} footerClassName={cn('footer-no-padding-top')} />
        </div>
    );
};
