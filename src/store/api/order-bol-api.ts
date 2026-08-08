import { OrderStatus } from '@/enums';
import { Attachment } from '@/shared';
import { OrderCommodity } from '@store/api/orders-api';
import { OrderVehicle } from '@/shared/types';
import { Inspections } from '@store/client/order-BOL/types';
import { OrderDeliveryInformation, OrderDetails, OrderPickupInformation } from '@store/common/orders/types';

import { apiSlice } from './api-slice';

export type OrderBOLVehicle = OrderVehicle & {
    inspections: Inspections | null;
};

export type OrderBOL = {
    publicId: string;
    order: {
        publicId: string;
        pickupInformation: OrderPickupInformation;
        deliveryInformation: OrderDeliveryInformation;
        details: OrderDetails;
        vehicles: OrderBOLVehicle[];
        commodities: OrderCommodity[];
        deliveredAt: string | null;
        acceptedAt: string;
        pickedUpAt: string | null;
        status: OrderStatus;
    };
    attachment: Attachment;
    createdAt: string;
    updatedAt: string;
};

export const orderBolApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrderBol: builder.query<OrderBOL, { orderId: string }>({
            query: ({ orderId }) => ({
                url: `orders/${orderId}/bol`,
                method: 'get',
            }),
            transformResponse: (response: { data: OrderBOL }) => response.data,
        }),
    }),
});

export const { useGetOrderBolQuery, useLazyGetOrderBolQuery } = orderBolApi;
