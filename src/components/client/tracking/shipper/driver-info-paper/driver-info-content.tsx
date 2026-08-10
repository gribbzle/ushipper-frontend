import React, { MouseEvent, useCallback } from 'react';
import { toast } from 'react-toastify';

import { ActiveRequestTimelinePrice } from '@/components/client/tracking/shipper/active-requests/active-request-timeline-price/active-request-timeline-price';
import { ShipperOrderTag } from '@/components/client/tracking/shipper/shipper-tracking-order-tag/shipper-tracking-order-tag';
import { Avatar } from '@/components/common/avatar/avatar';
import { Button } from '@/components/common/button/button';
import { RatingBar } from '@/components/common/rating-bar/rating-bar';
import { TrackingOrderStatus } from '@/enums/tracking/tracking-order-status-enum';
import { isNumber } from '@/shared';
import { useAppDispatch, useAppSelector } from '@store';
import { useLazyGetOrderQuery } from '@store/api/orders-api';
import {
    chatsActions,
    openChatByOrderIdAction,
    ordersActions,
    selectedActiveRequestSelector,
    selectedShipperTrackingOrderSelector,
    TrackingDriver,
} from '@store/client';
import { requestsSliceActions } from '@store/client/requests/slice';
import { RatingOneStarIcon } from '@/components/ui/inputs/rating';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isUshipper } from '@utils/project-config';
import {
    getFormattedTrackingDriverAverageSpeed,
    getTrackingDriverRating,
    getTrackingDriverReviewsTotal,
    getTrackingDriverTruckLoadPercentage,
} from '@utils/tracking/tracking-driver-helpers';

import { CountersRow } from '../counters-row';

import './driver-info-paper.scss';
import LikeIcon from '@/assets/icons/like-icon.svg';

const cn = classname('driver-info-paper');
const t = translateByNamespace('client:tracking-page:driver-info-paper');
const counterT = translateByNamespace('client:tracking-page:counters');

export const DriverInfoContent = ({ driver }: { driver: TrackingDriver }) => {
    const activeRequest = useAppSelector(selectedActiveRequestSelector);
    const selectedOrder = useAppSelector(selectedShipperTrackingOrderSelector);

    const dispatch = useAppDispatch();
    const [getOrder] = useLazyGetOrderQuery();

    const onSendOfferClickHandler = useCallback(async () => {
        if (selectedOrder) {
            try {
                const order = await getOrder(selectedOrder.publicId).unwrap();

                if (activeRequest) {
                    dispatch(
                        requestsSliceActions.setRequestDrawer({
                            isOpen: true,
                            order,
                            request: activeRequest,
                        }),
                    );
                } else {
                    dispatch(
                        ordersActions.setOrderSendOfferToCarrierDrawerProps({
                            isVisible: true,
                            orderId: selectedOrder.publicId,
                            order,
                        }),
                    );
                }
            } catch {
                toast.error<string>(t('load-order-error'));
            }
        }
    }, [selectedOrder, getOrder, activeRequest, dispatch]);

    const handleMessageButton = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (selectedOrder) {
                dispatch(openChatByOrderIdAction(selectedOrder.publicId)).then(() => {
                    dispatch(
                        chatsActions.setIsDrawerOpen({
                            isDrawerOpen: true,
                            needToReset: false,
                            setSelectedAtTop: true,
                        }),
                    );
                });
            }
        },
        [dispatch, selectedOrder],
    );

    const { isFlagged, orders, companyName, avatar, name, dispatchedByCurrentUser } = driver;
    const rating = getTrackingDriverRating(driver);
    const truckLoadPercentage = getTrackingDriverTruckLoadPercentage(driver);

    const countersData = [];

    if (isUshipper) {
        countersData.push({
            title: counterT('truck-load'),
            value: isNumber(truckLoadPercentage) ? `${Math.round(truckLoadPercentage)} %` : null,
        });
    }

    countersData.push(
        {
            title: counterT('average-speed'),
            value: getFormattedTrackingDriverAverageSpeed(driver),
        },
        {
            title: counterT('stops'),
            value: orders.length,
        },
    );

    return (
        <div className={cn('column')}>
            <div className={cn('row', { personal: true })}>
                <Avatar src={avatar?.url} className={cn('avatar')} />
                <div className={cn('column', { user: true })}>
                    <div className={cn('row', { name: true })}>
                        <h4>{name}</h4>
                        {isFlagged && <LikeIcon />}
                    </div>
                    <div className={cn('row', { rating: true })}>
                        <RatingOneStarIcon initialValue={rating ?? 0} />
                        <p>
                            {(rating ?? 0).toFixed(1)} <span>({counterT('reviews', { count: getTrackingDriverReviewsTotal(driver) })})</span>
                        </p>
                    </div>
                </div>
            </div>
            <p>{companyName}</p>
            <div className={cn('column', { counters: true })}>
                {isUshipper && <RatingBar percentage={truckLoadPercentage ?? 0} />}
                <CountersRow counters={countersData} />
            </div>
            {activeRequest && selectedOrder && <ActiveRequestTimelinePrice request={activeRequest} order={selectedOrder} />}
            <ShipperOrderTag view={TrackingOrderStatus.DISPATCHED}>{counterT('dispatched-orders', { count: dispatchedByCurrentUser })}</ShipperOrderTag>
            {selectedOrder && (
                <div className={cn('row', { actions: true })}>
                    <Button size='medium' view='primary' plain={true} onClick={handleMessageButton}>
                        {t('message')}
                    </Button>
                    <Button size='medium' view='primary' onClick={onSendOfferClickHandler}>
                        {t('send-offer')}
                    </Button>
                </div>
            )}
        </div>
    );
};
