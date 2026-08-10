import React, { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { OrderChatDrawer } from '@/components/client/orders/drawers/order-chat-drawer';
import { OrderSendOfferToCarrierDrawer } from '@/components/client/orders/drawers/order-send-offer-to-carrier-drawer';
import { SendOfferToRequestDrawer } from '@/components/client/requests';
import { TrackingOrderStatus } from '@/enums/tracking/tracking-order-status-enum';
import { useQueryFilters } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { useGetTrackingOrdersQuery } from '@store/api/tracking-api';
import { isShipperOrdersListShownSelector, ShipperTrackingFiltersFormState, trackingActions } from '@store/client';
import { classname } from '@utils/classname';
import { convertToStringArray } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

import { OrdersTrackingMap, ShippersOrdersListPaper, ShipperTrackingFiltersBlock, ShipperTrackingOrderPaper, TrackingHelpPaper } from '../../shipper';

import './shipper-tracking-page.scss';

const t = translateByNamespace('client:tracking-page');
const cn = classname('shipper-tracking-page');

export const ShipperTrackingPage = () => {
    const dispatch = useAppDispatch();
    const {
        filters: { dispatchers, status, driverFlagged, grouping },
    } = useQueryFilters<ShipperTrackingFiltersFormState>();
    const isOrdersListShown = useAppSelector(isShipperOrdersListShownSelector);

    const params = ({
	...status && status !== 'all' ? { status: [status as TrackingOrderStatus] } : {},
	grouping: grouping ?? 'status',
	...dispatchers ? { dispatchers: convertToStringArray(dispatchers) } : {},
	...driverFlagged && driverFlagged !== 'all' ? { driverFlagged: true } : {}
});

    const { data: trackingOrdersData, isFetching, isError } = useGetTrackingOrdersQuery(params);

    useEffect(() => {
        if (isError) {
            toast.error<string>(t('notifications:upload-orders-error'));
        }
    }, [isError]);

    useEffect(() => {
        dispatch(trackingActions.setIsShipperOrdersTrackingLoading(isFetching));
    }, [isFetching, dispatch]);

    useEffect(() => {
        const shouldOpenFilters = Boolean(dispatchers || status || driverFlagged);

        if (shouldOpenFilters) {
            dispatch(trackingActions.setOpenShipperTrackingFilters(true));
        }
    }, [dispatch, dispatchers, status, driverFlagged]);

    const ordersForMap = useMemo(() => trackingOrdersData?.flatMap(group => group.orders) ?? [], [trackingOrdersData]);
    const totalOrdersCounter = useMemo(() => trackingOrdersData?.flatMap(group => group.orders).length, [trackingOrdersData]);

    return (
        <div className={cn('')}>
            <OrdersTrackingMap orders={ordersForMap} />
            <ShippersOrdersListPaper totalCounter={totalOrdersCounter} groupedOrders={trackingOrdersData} />
            <TrackingHelpPaper />
            <ShipperTrackingFiltersBlock />
            {!isOrdersListShown && <ShipperTrackingOrderPaper />}

            <SendOfferToRequestDrawer />
            <OrderSendOfferToCarrierDrawer />
            <OrderChatDrawer />
        </div>
    );
};
