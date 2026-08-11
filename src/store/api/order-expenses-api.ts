import { Attachment } from '@/shared/types';

import { apiSlice } from './api-slice';

export type OrderExpense = {
    id: number;
    publicId: string;
    type: string;
    price: number;
    receiptAt: string;
    specifyType: string | null;
    attachment: Attachment | File | null;
    showExpenseOnInvoice: boolean;
    deductFromDriverPay: boolean;
};

const orderExpensesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrderExpenses: builder.query<OrderExpense[], string>({
            query: orderId => ({
                url: `orders/${orderId}/expenses`,
                method: 'get',
            }),
            providesTags: [{ type: 'OrderExpense', id: 'LIST' }],
            transformResponse: (response: { data: OrderExpense[] }) => response.data,
        }),
        createOrderExpense: builder.mutation<OrderExpense, { orderId: string; expense: OrderExpense }>({
            query: ({ orderId, expense }) => {
                const { attachment, ...rest } = expense;

                const data = {
                    ...rest,
                };

                if (attachment instanceof File) {
                    Object.assign(data, { file: attachment });
                }

                return {
                    url: `orders/${orderId}/expenses`,
                    method: 'post',
                    data,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };
            },
            invalidatesTags: result => (result ? [{ type: 'OrderExpense', id: 'LIST' }] : []),
            transformResponse: (response: { data: OrderExpense }) => response.data,
        }),
        deleteOrderExpense: builder.mutation<void, { orderId: string; expenseId: string }>({
            query: ({ orderId, expenseId }) => ({
                url: `orders/${orderId}/expenses/${expenseId}`,
                method: 'delete',
            }),
            invalidatesTags: (_result, error) => (error ? [] : [{ type: 'OrderExpense', id: 'LIST' }]),
        }),
        updateOrderExpense: builder.mutation<OrderExpense, { orderId: string; expenseId: string; expense: OrderExpense }>({
            query: ({ orderId, expenseId, expense }) => {
                const { attachment, ...rest } = expense;

                const data = {
                    ...rest,
                };

                if (attachment instanceof File) {
                    Object.assign(data, { file: attachment });
                }

                if (attachment === null) {
                    Object.assign(data, { file: '' });
                }

                return {
                    url: `orders/${orderId}/expenses/${expenseId}?_method=patch`,
                    method: 'post',
                    data,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };
            },
            invalidatesTags: result => (result ? [{ type: 'OrderExpense', id: 'LIST' }] : []),
            transformResponse: (response: { data: OrderExpense }) => response.data,
        }),
    }),
});

export const { useDeleteOrderExpenseMutation, useGetOrderExpensesQuery, useCreateOrderExpenseMutation, useUpdateOrderExpenseMutation } = orderExpensesApi;
