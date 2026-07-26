import { OrderStatus, TrackingOrderStatus } from '@/enums';
import { SelectedShipperTrackingOrder } from '@store/client';

const statusTitleMap: Record<OrderStatus, TrackingOrderStatus> = {
    [OrderStatus.NEW]: TrackingOrderStatus.NOT_DISPATCHED,
    [OrderStatus.ON_HOLD]: TrackingOrderStatus.NOT_DISPATCHED,
    [OrderStatus.POSTED]: TrackingOrderStatus.NOT_DISPATCHED,
    [OrderStatus.PENDING]: TrackingOrderStatus.NOT_DISPATCHED,
    [OrderStatus.DECLINED]: TrackingOrderStatus.NOT_DISPATCHED,
    [OrderStatus.CANCELED]: TrackingOrderStatus.NOT_DISPATCHED,
    [OrderStatus.ACCEPTED]: TrackingOrderStatus.DISPATCHED,
    [OrderStatus.PICKED_UP]: TrackingOrderStatus.PICKED_UP,
    [OrderStatus.DELIVERED]: TrackingOrderStatus.PICKED_UP,
};

export const mapOrderStatusToTrackingStatus = (status: OrderStatus): TrackingOrderStatus => statusTitleMap[status] ?? TrackingOrderStatus.NOT_DISPATCHED;

export const getOrderStatusForTracking = (order: SelectedShipperTrackingOrder): TrackingOrderStatus | undefined =>
    order ? mapOrderStatusToTrackingStatus(order.status) : undefined;
