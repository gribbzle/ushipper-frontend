import React, { useMemo } from 'react';

import { OfferStatusesEnum } from '@/enums';
import { RequestStatusesEnum } from '@/enums/request-statuses';
import { Button, FlagButton, PaymentInfo } from '@components';
import { useMeAdmin, useMeDriverRelated, useMeShipper } from '@hooks';
import { classname, translateByNamespace } from '@utils';

import { useLoadboardItemActions } from '../../hooks';
import { LoadboardItemProps } from '../../loadboard-item.types';

import { useDriverRequestsInfo } from './use-driver-requests-info';

import './loadboard-item-right-block.scss';

const cn = classname('loadboard-item-right-block');
const t = translateByNamespace('client:loadboard:item');
const translateRequest = translateByNamespace('client:loadboard:request-form');

export const LoadboardItemRightBlock = ({ order, loadBoardFilters }: Omit<LoadboardItemProps, 'tagged'>) => {
    const { latestOffer, latestRequest, carrierOrder, driverRequests } = order;
    const isMeShipper = useMeShipper();
    const isMeAdmin = useMeAdmin();
    const isDriver = useMeDriverRelated();

    const {
        sendRequest,
        handleMarkOrderAsFlaggedClick,
        handleMarkOrderAsUnFlaggedClick,
        viewDetails,
        handleCancelLatestRequest,
        handleCancelDriverRequest,
        handleViewOffer,
        handleViewOrder,
    } = useLoadboardItemActions({ order, loadBoardFilters });

    const isSendLatestRequest = useMemo(
        () => !isMeShipper && !isDriver && !latestOffer && (!latestRequest || latestRequest?.status === RequestStatusesEnum.CANCELED),
        [isMeShipper, latestOffer, latestRequest, isDriver],
    );

    const isSendDriverRequest = useMemo(
        () =>
            isDriver &&
            !latestOffer &&
            (!latestRequest || latestRequest?.status === RequestStatusesEnum.CANCELED) &&
            (!driverRequests || driverRequests[0]?.status === RequestStatusesEnum.CANCELED),
        [latestOffer, latestRequest, driverRequests, isDriver],
    );

    const isCancelLatestRequest = useMemo(
        () =>
            !isMeAdmin &&
            !isMeShipper &&
            !isDriver &&
            latestRequest &&
            latestRequest?.status !== RequestStatusesEnum.CANCELED &&
            latestRequest?.status !== RequestStatusesEnum.DECLINED &&
            !isSendLatestRequest &&
            latestOffer?.status !== OfferStatusesEnum.ACCEPTED &&
            latestOffer?.status !== OfferStatusesEnum.NEW,
        [isMeAdmin, isMeShipper, latestRequest, isSendLatestRequest, isDriver, latestOffer?.status],
    );

    const isCancelDriverRequest = useMemo(
        () => isDriver && driverRequests && driverRequests[0]?.status !== RequestStatusesEnum.CANCELED,
        [driverRequests, isDriver],
    );

    const { driverRequestForDriverInfo, driverRequestForDispatcherInfo } = useDriverRequestsInfo({ order });

    return (
        <div className={cn('')}>
            <div>
                <PaymentInfo order={order} />
                {driverRequestForDriverInfo}
                {driverRequestForDispatcherInfo}
                <div className={cn('buttons')}>
                    {isCancelLatestRequest && (
                        <Button view='danger' size='small' onClick={handleCancelLatestRequest}>
                            {translateRequest('cancel-request-btn')}
                        </Button>
                    )}
                    {isCancelDriverRequest && (
                        <Button view='danger' size='small' onClick={handleCancelDriverRequest}>
                            {translateRequest('cancel-request-btn')}
                        </Button>
                    )}
                    {latestOffer?.status === OfferStatusesEnum.ACCEPTED && carrierOrder?.publicId && (
                        <Button view='primary' size='small' onClick={() => handleViewOrder(carrierOrder.publicId)}>
                            {t('view-order')}
                        </Button>
                    )}
                    {!isDriver && latestOffer?.status === OfferStatusesEnum.NEW && (
                        <Button view='primary' size='small' onClick={() => handleViewOffer(latestOffer)}>
                            {t('view-offer')}
                        </Button>
                    )}
                    {isSendLatestRequest && (
                        <Button view='primary' size='small' onClick={sendRequest}>
                            {t('send-request')}
                        </Button>
                    )}
                    {isSendDriverRequest && (
                        <Button view='primary' size='small' onClick={sendRequest}>
                            {t('send-request')}
                        </Button>
                    )}
                    {!isDriver && (
                        <Button size='small' onClick={() => viewDetails()}>
                            {t('view-details')}
                        </Button>
                    )}
                </div>
            </div>
            {!isMeShipper && (
                <FlagButton
                    isFlagged={order.isFlagged}
                    handleMarkAsFlaggedClick={handleMarkOrderAsFlaggedClick}
                    handleMarkAsUnFlaggedClick={handleMarkOrderAsUnFlaggedClick}
                />
            )}
        </div>
    );
};
