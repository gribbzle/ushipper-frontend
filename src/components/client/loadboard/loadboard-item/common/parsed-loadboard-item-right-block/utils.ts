import { toCamelCase } from 'js-convert-case';

import { OrderDeliveryInformation, OrderPickupInformation } from '@store/client';
import { ParsedOrderData } from '@store/client/loadboard';

export const formattedParsedOrder = (obj: any): ParsedOrderData => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    const result: Partial<ParsedOrderData> = {};

    Object.keys(obj).forEach(key => {
        const camelKey = toCamelCase(key) as keyof ParsedOrderData;
        const value = obj[key];

        switch (camelKey) {
            case 'pickupInformation':
                result.pickupInformation = {
                    streetAddress: value.street_address,
                    city: value.city,
                    state: value.state,
                    zip: value.zip,
                } as Pick<OrderPickupInformation, 'streetAddress' | 'city' | 'state' | 'zip'>;
                break;
            case 'deliveryInformation':
                result.deliveryInformation = {
                    streetAddress: value.street_address,
                    city: value.city,
                    state: value.state,
                    zip: value.zip,
                    scheduledDeliveryAt: value.scheduled_delivery_at,
                } as Pick<OrderDeliveryInformation, 'streetAddress' | 'city' | 'state' | 'zip' | 'scheduledDeliveryAt'>;
                break;
            default:
                result[camelKey] = value;
        }
    });

    return result as ParsedOrderData;
};
