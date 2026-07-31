import { CommodityFormState } from '@/store/common/orders/types';

import { apiSlice } from './api-slice';
import { OrderCommodity } from './orders-api';

const orderCommodityApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrderCommodities: builder.query<OrderCommodity[], string>({
            query: publicOrderId => ({
                url: `orders/${publicOrderId}/commodities`,
                method: 'get',
            }),
            providesTags: [{ type: 'OrderCommodity', id: 'LIST' }],
            transformResponse: (response: { data: OrderCommodity[] }) => response.data,
        }),
        getOrderCommodity: builder.query<OrderCommodity, { orderId: string; commodityId: string }>({
            query: ({ orderId, commodityId }) => ({
                url: `orders/${orderId}/commodities/${commodityId}`,
                method: 'get',
            }),
            transformResponse: (response: { data: OrderCommodity }) => response.data,
            providesTags: result => [{ type: 'OrderCommodity', id: result?.publicId }],
        }),
        createOrderCommodity: builder.mutation<OrderCommodity, { orderId: string; data: CommodityFormState }>({
            query: ({ orderId, data }) => ({
                url: `orders/${orderId}/commodities`,
                method: 'post',
                data,
            }),
            invalidatesTags: [{ type: 'OrderCommodity', id: 'LIST' }],
            transformResponse: (response: { data: OrderCommodity }) => response.data,
        }),
        updateOrderCommodity: builder.mutation<OrderCommodity, { orderId: string; commodityId: string; data: CommodityFormState }>({
            query: ({ orderId, commodityId, data }) => ({
                url: `orders/${orderId}/commodities/${commodityId}`,
                method: 'patch',
                data,
            }),
            invalidatesTags: [{ type: 'OrderCommodity', id: 'LIST' }],
            transformResponse: (response: { data: OrderCommodity }) => response.data,
        }),
        deleteOrderCommodity: builder.mutation<void, { orderId: string; commodityId: string }>({
            query: ({ orderId, commodityId }) => ({
                url: `orders/${orderId}/commodities/${commodityId}`,
                method: 'delete',
            }),
            invalidatesTags: [{ type: 'OrderCommodity', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetOrderCommoditiesQuery,
    useGetOrderCommodityQuery,
    useDeleteOrderCommodityMutation,
    useCreateOrderCommodityMutation,
    useUpdateOrderCommodityMutation,
} = orderCommodityApi;
