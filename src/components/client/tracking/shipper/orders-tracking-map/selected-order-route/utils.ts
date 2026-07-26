import { TrackingMapPoint } from '@store/client';

export const isDriverPoint = (point: TrackingMapPoint, driver?: { publicId: string } | null): boolean => !!driver && point.orderId === driver.publicId;

export const isSelectedOrderPoint = (point: TrackingMapPoint, selectedOrder?: { publicId: string }): boolean =>
    !!selectedOrder && point.orderId === selectedOrder.publicId;
