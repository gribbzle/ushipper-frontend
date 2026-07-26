import { TrackingOrderStatus } from '@/enums';
import { Load, ShipperTrackingOrder } from '@store/client';

import { mapOrderStatusToTrackingStatus } from './map-order-status-to-tracking-order-status';

export const isTrackingOrderNotDispatched = (order: ShipperTrackingOrder | Load): boolean =>
    mapOrderStatusToTrackingStatus(order.status) === TrackingOrderStatus.NOT_DISPATCHED;

export const isTrackingOrderPickedUp = (order: ShipperTrackingOrder | Load): boolean =>
    mapOrderStatusToTrackingStatus(order.status) === TrackingOrderStatus.PICKED_UP;
