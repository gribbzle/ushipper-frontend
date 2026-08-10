import { TransportTypeEnum } from '@/enums/transport-type-enum';
import { OrderVehicle } from '@/shared/types';
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
