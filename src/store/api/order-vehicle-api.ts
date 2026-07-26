import { Inspections } from '@store/client/order-BOL';
import { VehicleFormState } from '@store/common';

import { apiSlice } from './api-slice';
import { OrderVehicle } from './orders-api';

const orderVehicleApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrderVehicles: builder.query<OrderVehicle[], string>({
            query: publicOrderId => ({
                url: `orders/${publicOrderId}/vehicles`,
                method: 'get',
            }),
            providesTags: [{ type: 'OrderVehicle', id: 'LIST' }],
            transformResponse: (response: { data: OrderVehicle[] }) => response.data,
        }),
        getOrderVehicleInspections: builder.query<Inspections, { orderId: string; vehicleId: number }>({
            query: ({ orderId, vehicleId }) => ({
                url: `orders/${orderId}/vehicles/${vehicleId}/inspections`,
                method: 'get',
            }),
            transformResponse: (response: { data: Inspections }) => response.data,
        }),
        createOrderVehicle: builder.mutation<OrderVehicle, { orderId: string; data: VehicleFormState }>({
            query: ({ orderId, data }) => ({
                url: `orders/${orderId}/vehicles`,
                method: 'post',
                data: data,
            }),
            invalidatesTags: [{ type: 'OrderVehicle', id: 'LIST' }],
            transformResponse: (response: { data: OrderVehicle }) => response.data,
        }),
        updateOrderVehicle: builder.mutation<OrderVehicle, { orderId: string; vehicleId: number; data: VehicleFormState }>({
            query: ({ orderId, vehicleId, data }) => ({
                url: `orders/${orderId}/vehicles/${vehicleId}`,
                method: 'patch',
                data: data,
            }),
            invalidatesTags: [{ type: 'OrderVehicle', id: 'LIST' }],
            transformResponse: (response: { data: OrderVehicle }) => response.data,
        }),
        deleteOrderVehicle: builder.mutation<void, { orderId: string; vehicleId: number }>({
            query: ({ orderId, vehicleId }) => ({
                url: `orders/${orderId}/vehicles/${vehicleId}`,
                method: 'delete',
            }),
            invalidatesTags: [{ type: 'OrderVehicle', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetOrderVehiclesQuery,
    useGetOrderVehicleInspectionsQuery,
    useDeleteOrderVehicleMutation,
    useCreateOrderVehicleMutation,
    useUpdateOrderVehicleMutation,
} = orderVehicleApi;
