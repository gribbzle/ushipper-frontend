import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';

export type ShipperTrackingOrderRouteProps = {
    pickupInformation?: Partial<OrderPickupInformation>;
    deliveryInformation?: Partial<OrderDeliveryInformation>;
    showTruck?: boolean;
};
