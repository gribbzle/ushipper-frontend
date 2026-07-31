import React, { MouseEvent, useCallback } from 'react';

import { useAppDispatch } from '@store';
import { OrderRequest } from '@store/api/order-requests-api';
import { ShipperTrackingOrder, trackingActions } from '@store/client';
import { classname } from '@utils/classname';

import { ManagerInfo } from '../../manager-info';
import { ActiveRequestTimelinePrice } from '../active-request-timeline-price';

import './active-request-item.scss';

type ActiveRequestItemProps = {
    request: OrderRequest;
    order: ShipperTrackingOrder;
};

const cn = classname('active-request-item');

export const ActiveRequestItem = ({ request, order }: ActiveRequestItemProps) => {
    const dispatch = useAppDispatch();

    const {
        carrierCompany: { rating, name: companyName, owner },
    } = request;

    const onItemClickHandler = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            dispatch(trackingActions.setSelectedActiveRequest(request));
            dispatch(trackingActions.setSelectedShipperTrackingOrder(order));
            dispatch(trackingActions.setSelectedDriverId(order.driver?.publicId ?? null));
        },
        [dispatch, order, request],
    );

    return (
        <div className={cn('')} onClick={e => onItemClickHandler(e)} tabIndex={0}>
            <ManagerInfo name={owner.name} avatarUrl={owner.avatar?.url} companyName={companyName} rating={rating} size='medium' />
            <ActiveRequestTimelinePrice request={request} order={order} />
        </div>
    );
};
