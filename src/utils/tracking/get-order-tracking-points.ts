import { OrderStatus } from '@/enums';
import { Load, ShipperTrackingOrder, TrackingDriver, TrackingDriverOrder, TrackingMapPoint } from '@store/client';

export type CreateTrackingMapPointValues = Omit<TrackingMapPoint, 'lat' | 'lon'> & {
    lat?: number | null;
    lon?: number | null;
};

export const createTrackingMapPoint = ({ needTobeHereAt, lat, lon, ...rest }: CreateTrackingMapPointValues): TrackingMapPoint | undefined => {
    return lat && lon
        ? {
              needTobeHereAt: new Date(needTobeHereAt),
              lat,
              lon,
              ...rest,
          }
        : undefined;
};

export const getDriverPoint = (driver: TrackingDriver): CreateTrackingMapPointValues => ({
    pointId: `${driver.publicId}-driver`,
    needTobeHereAt: new Date(driver.latestLocation?.createdAt as string),
    lat: driver.latestLocation?.geoLatitude,
    lon: driver.latestLocation?.geoLongitude,
    orderId: driver.publicId,
    markerType: 'pickup',
    orderStatus: OrderStatus.PICKED_UP,
});

export const getPickupPoint = (order: ShipperTrackingOrder | Load | TrackingDriverOrder): CreateTrackingMapPointValues => {
    const { publicId, pickupInformation, status } = order;

    return {
        pointId: `${publicId}-pickup`,
        needTobeHereAt: new Date(pickupInformation.scheduledPickupAt as string),
        lat: pickupInformation.geoLatitude,
        lon: pickupInformation.geoLongitude,
        orderId: publicId,
        markerType: 'pickup',
        orderStatus: status,
    };
};

export const getDeliveryPoint = (order: ShipperTrackingOrder | Load | TrackingDriverOrder): CreateTrackingMapPointValues => {
    const { publicId, deliveryInformation, status } = order;

    return {
        pointId: `${publicId}-delivery`,
        needTobeHereAt: new Date(deliveryInformation.scheduledDeliveryAt as string),
        lat: deliveryInformation.geoLatitude,
        lon: deliveryInformation.geoLongitude,
        orderId: publicId,
        markerType: 'delivery',
        orderStatus: status,
    };
};

export const getOrderTrackingPoints = (order: Load | ShipperTrackingOrder) => {
    const startPoint: TrackingMapPoint | undefined = createTrackingMapPoint(getPickupPoint(order));
    const endPoint: TrackingMapPoint | undefined = createTrackingMapPoint(getDeliveryPoint(order));

    return { startPoint, endPoint };
};
