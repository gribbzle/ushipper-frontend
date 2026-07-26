import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';

export const formatAddressLine = (addressInfo?: Partial<OrderDeliveryInformation> | Partial<OrderPickupInformation>) =>
    [addressInfo?.zip && `${addressInfo.zip}`, addressInfo?.state && `${addressInfo.state}`].filter(Boolean).join(', ');
