import React, { useMemo } from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { OrderRoute } from '@/components/client/orders/order-route/order-route';
import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { ViewOrderRouteButton } from '@/components/client/orders/view-order-route-button/view-order-route-button';
import { LoadBoardOrderBrokerColumn } from '@/components/common/load-board-order-broker-column/load-board-order-broker-column';
import { Paper } from '@/components/common/paper/paper';
import { OfferStatusesEnum } from '@/enums/offer-statuses-enum';
import { RequestStatusesEnum } from '@/enums/request-statuses';
import { getFinalPaymentAmount } from '@/utils/payment';
import { useMeCarrier, useMeShipper } from '@hooks';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

import { LoadboardItemCommoditiesColumn, LoadboardItemRightBlock, LoadboardItemVehiclesColumn } from './common';
import { LoadboardItemProps } from './loadboard-item.types';

import './loadboard-item.scss';

const cn = classname('loadboard-item');
const t = translateByNamespace('client:loadboard:item');

export const LoadboardItem = ({ order, tagged, loadBoardFilters }: LoadboardItemProps) => {
    const { pickupInformation, deliveryInformation, drivingDistance, company, latestOffer } = order;

    const isMeCarrier = useMeCarrier();
    const isMeShipper = useMeShipper();

    const totalLatestOfferPrice = useMemo(
        () => getFinalPaymentAmount(latestOffer?.paymentPrice, latestOffer?.delayedPayment, latestOffer?.brokerFee),
        [latestOffer?.brokerFee, latestOffer?.delayedPayment, latestOffer?.paymentPrice],
    );

    return (
        <Paper
            className={cn('', { flagged: order.isFlagged && !isMeShipper, tagged: tagged, offerStatus: latestOffer?.status })}
            body={
                <>
                    <div className={cn('status-info')}>
                        {tagged && (
                            <>
                                <OrderTag view='new'>{t('new')}</OrderTag>
                                <OrderTag view='tagged'>{t('posted-time', { time: diffForHumans(new Date(order.postedAt)) })}</OrderTag>
                            </>
                        )}
                        {order.latestRequest?.status === RequestStatusesEnum.DECLINED && (
                            <OrderTag view='accepted'>
                                {t('request-declined', {
                                    price: formatToCurrency(order.latestRequest.paymentPrice),
                                })}
                            </OrderTag>
                        )}
                        {order.latestRequest &&
                            latestOffer?.status !== OfferStatusesEnum.ACCEPTED &&
                            latestOffer?.status !== OfferStatusesEnum.DECLINED &&
                            [RequestStatusesEnum.NEW].includes(order.latestRequest.status) && (
                                <>
                                    <OrderTag view='posted'>
                                        {order.latestRequest.type === 'driver_to_dispatcher'
                                            ? t('latest-request-to-info')
                                            : t('request-sent', {
                                                  price: formatToCurrency(order.latestRequest.paymentPrice),
                                              })}
                                    </OrderTag>
                                    <span className={cn('sent-ago')}>{diffForHumans(new Date(order.latestRequest.createdAt))}</span>
                                </>
                            )}
                        {order.latestRequest?.status === RequestStatusesEnum.CANCELED && (
                            <>
                                <OrderTag view='accepted'>
                                    {order.latestRequest.type === 'driver_to_dispatcher'
                                        ? t('latest-request-cancelled-info', { time: '' })
                                        : t('request-canceled', {
                                              price: formatToCurrency(order.latestRequest.paymentPrice),
                                          })}
                                </OrderTag>
                                {order.latestRequest.canceledAt && (
                                    <span className={cn('sent-ago')}>{diffForHumans(new Date(order.latestRequest.canceledAt))}</span>
                                )}
                            </>
                        )}
                        {latestOffer?.status === OfferStatusesEnum.ACCEPTED && (
                            <>
                                <OrderTag view='delivered'>{t('booked')}</OrderTag>
                                {latestOffer?.acceptedAt && <span className={cn('sent-ago')}>{diffForHumans(new Date(latestOffer.acceptedAt))}</span>}
                            </>
                        )}
                        {latestOffer?.status === OfferStatusesEnum.DECLINED && (
                            <>
                                <OrderTag view='accepted'>
                                    {t('offer-declined', {
                                        price: formatToCurrency(totalLatestOfferPrice),
                                    })}
                                </OrderTag>
                                {latestOffer?.declinedAt && <span className={cn('sent-ago')}>{diffForHumans(new Date(latestOffer.declinedAt))}</span>}
                            </>
                        )}
                        {latestOffer?.status === OfferStatusesEnum.NEW && (
                            <>
                                <OrderTag view='advanced'>
                                    {t('offer-received', {
                                        price: formatToCurrency(totalLatestOfferPrice),
                                    })}
                                </OrderTag>
                                {latestOffer?.createdAt && <span className={cn('sent-ago')}>{diffForHumans(new Date(latestOffer.createdAt))}</span>}
                            </>
                        )}
                    </div>
                    <div className={cn('item-content', { carrier: isMeCarrier })}>
                        <div className={cn('left-block')}>
                            <OrderItemInfoColumn title={t('route-title')}>
                                <OrderRoute pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} />
                                <ViewOrderRouteButton
                                    pickupInformation={pickupInformation}
                                    deliveryInformation={deliveryInformation}
                                    drivingDistance={drivingDistance}
                                />
                            </OrderItemInfoColumn>
                            <OrderItemInfoColumn title={t('broker')}>
                                <LoadBoardOrderBrokerColumn company={company} details={order.details} />
                            </OrderItemInfoColumn>
                            {renderProjectSpecificComponent(
                                {
                                    LoadboardItemVehiclesColumn: <LoadboardItemVehiclesColumn order={order} />,
                                    LoadboardItemCommoditiesColumn: <LoadboardItemCommoditiesColumn order={order} />,
                                },
                                'loadboardItemProductsColumn',
                            )}
                        </div>
                        <LoadboardItemRightBlock order={order} loadBoardFilters={loadBoardFilters} />
                    </div>
                </>
            }
        />
    );
};
