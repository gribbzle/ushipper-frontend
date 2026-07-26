import { TransportTypeEnum } from '@/enums';
import { OrderVehicle } from '@store/api/orders-api';
import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';

export type ParsedOrderRouteProps = {
    pickupInformation?: Partial<OrderPickupInformation>;
    deliveryInformation?: Partial<OrderDeliveryInformation>;
    vehicles: (OrderVehicle | string)[];
    drivingDistance?: number;
    inline?: boolean;
    reverse?: boolean;
    hasInopVehicles?: boolean;
    trailerType?: TransportTypeEnum | null;
    hideDirectionDistance?: boolean;
};
