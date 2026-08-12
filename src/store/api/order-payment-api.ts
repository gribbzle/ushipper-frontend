import { PaymentMethod } from '@/enums/payment-method';

import { apiSlice } from './api-slice';

export type OrderMarkAsPaidFormState = Partial<{
    orderId: string;
    invoiceId: string;
    paidAmount: number;
    paidMethod: PaymentMethod;
    referenceNumber: string;
    receiptAt: string;
    paymentTerms: string;
    publicId: string;
}>;

type OrderPaymentResponse = {
    payer: string | null;
    receiver: string;
    paidAmount: number;
    paidMethod: PaymentMethod;
    referenceNumber: string | null;
    receiptAt: string;
    paymentTerms: string | null;
};

export const orderPaymentApi = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: builder => ({
        createOrderPayment: builder.mutation<OrderPaymentResponse, OrderMarkAsPaidFormState>({
            query: ({ orderId, ...data }) => ({
                url: `orders/${orderId}/payments`,
                method: 'post',
                data,
            }),
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }],
            transformResponse: (response: { data: OrderPaymentResponse }) => response.data,
        }),
        updateOrderPayment: builder.mutation<OrderPaymentResponse, OrderMarkAsPaidFormState>({
            query: ({ orderId, publicId, ...data }) => ({
                url: `orders/${orderId}/payments/${publicId}`,
                method: 'patch',
                data,
            }),
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }, { type: 'OrdersStatisticsCounters' }],
            transformResponse: (response: { data: OrderPaymentResponse }) => response.data,
        }),
    }),
});

export const { useCreateOrderPaymentMutation, useUpdateOrderPaymentMutation } = orderPaymentApi;
