import React, { Fragment, useMemo } from 'react';
import { Marker } from 'react-map-gl/mapbox';

import { OrderStatus } from '@/enums/order-status';
import { useAppSelector } from '@store';
import { selectedShipperTrackingOrderSelector } from '@store/client';
import { isTrackingOrderNotDispatched } from '@utils/tracking/shipper-tracking-order-helpers';

import { OrderPin } from '@/components/client/tracking/common/order-pin/order-pin';
import { TrackingMap } from '@/components/client/tracking/common/tracking-map/tracking-map';
import { DriverInfoPaper } from '../driver-info-paper';

import { DriversMarkers } from './driver-markers';
import { OrdersTrackingMapProps } from './orders-tracking-map.types';
import { SelectedOrderRoute } from './selected-order-route';
import { useOrdersTrackingMap } from './use-orders-tracking-map';
import { useSelectedOrderPickupText } from './use-selected-order-pickup-text';

export const OrdersTrackingMap = ({ orders }: OrdersTrackingMapProps) => {
    const { mapRef, bounds, driverPaperPosition, isOrdersListShown, handleOrderMarkerClick, handleDriverTruckMarkerClick } = useOrdersTrackingMap({
        orders,
    });

    const selectedOrder = useAppSelector(selectedShipperTrackingOrderSelector);
    const pickupText = useSelectedOrderPickupText();

    const orderMarkers = useMemo(
        () =>
            orders?.map(order => {
                const { pickupInformation, publicId, status } = order;
                const orderLatitude = pickupInformation?.geoLatitude;
                const orderLongitude = pickupInformation?.geoLongitude;

                const isSelectedOrder = selectedOrder?.publicId === publicId;
                const isOrderNotDispatched = isTrackingOrderNotDispatched(order);
                const isSelectedOrderNotDispatched = selectedOrder && isTrackingOrderNotDispatched(selectedOrder);

                const showDriverMarkers = isOrderNotDispatched && (!selectedOrder || isSelectedOrderNotDispatched);

                return (
                    orderLatitude &&
                    orderLongitude && (
                        <Fragment key={publicId}>
                            <Marker
                                style={{ zIndex: 1 }}
                                key={publicId}
                                latitude={orderLatitude}
                                longitude={orderLongitude}
                                anchor='bottom'
                                onClick={() => handleOrderMarkerClick(order)}
                            >
                                <OrderPin
                                    status={isSelectedOrder && isOrderNotDispatched ? OrderStatus.ACCEPTED : status}
                                    isHover={!isOrdersListShown}
                                    details={isSelectedOrder && pickupText ? pickupText : undefined}
                                />
                            </Marker>
                            {showDriverMarkers && <DriversMarkers orderId={publicId} onMarkerClick={handleDriverTruckMarkerClick} />}
                        </Fragment>
                    )
                );
            }),
        [orders, selectedOrder, isOrdersListShown, pickupText, handleDriverTruckMarkerClick, handleOrderMarkerClick],
    );

    return (
        <>
            <TrackingMap mapRef={mapRef} mapStyle='mapbox://styles/mapbox/streets-v9'>
                <SelectedOrderRoute mapRef={mapRef} bounds={bounds} />
                {orderMarkers}
            </TrackingMap>
            <DriverInfoPaper top={driverPaperPosition?.y} left={driverPaperPosition?.x} />
        </>
    );
};
