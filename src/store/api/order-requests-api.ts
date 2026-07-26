import { OfferToRequestStatusesEnum, PaymentMethod, RequestStatusesEnum } from '@/enums';
import { PaymentTerm } from '@/enums/payment-term';
import { Company } from '@store/admin';
import { apiSlice } from '@store/api/api-slice';
import { Order } from '@store/api/orders-api';
import { User } from '@store/common';
import { CursorPagination } from '@utils';

export type NewOffer = {
    publicId: string;
    paymentPrice: number;
    paymentTerms: PaymentTerm;
    createdAt: string;
    declinedAt: string | null;
    canceledAt: string | null;
    status: OfferToRequestStatusesEnum;
    brokerFee: number | null;
    delayedPayment: number | null;
};

export type OrderRequest = {
    carrierCompany: Company;
    comment: string;
    createdAt: string;
    creator: User;
    deliveryAt: string;
    paymentMethod: PaymentMethod;
    paymentPrice: number;
    pickupAt: string;
    publicId: string;
    status: RequestStatusesEnum;
    latestOffer: NewOffer | null;
    declinedAt: string | null;
    canceledAt: string | null;
    type?: 'company_to_company' | 'driver_to_dispatcher';
};

export type OrderRequestCreateArg = {
    paymentPrice: number;
    pickupAt: string;
    deliveryAt: string;
    comment: string;
    contactName: string;
};

type OrderRequestResponse = {
    requests: OrderRequest[];
    nextCursor?: string | null;
};
export const orderRequestsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRequests: builder.query<OrderRequestResponse, { orderId: string; cursor?: string }>({
            query: ({ orderId, cursor }) => ({
                url: `orders/${orderId}/requests`,
                method: 'get',
                params: {
                    orderName: 'created_at',
                    orderDirection: 'asc',
                    perPage: 5,
                    cursor,
                },
            }),
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                return `${endpointName}-${queryArgs.orderId}`;
            },
            merge: (currentCache, newItems) => {
                newItems.requests.forEach(newItem => {
                    const index = currentCache.requests.findIndex(cacheItem => cacheItem.publicId === newItem.publicId);

                    if (index === -1) {
                        currentCache.requests.push(newItem);
                    } else {
                        currentCache.requests[index] = newItem;
                    }
                });

                currentCache.nextCursor = newItems.nextCursor;
            },

            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            transformResponse: (response: { data: CursorPagination<OrderRequest[]> }) => ({
                requests: response.data.data,
                nextCursor: response.data.meta.nextCursor,
            }),
            providesTags: [{ type: 'Requests', id: 'LIST' }],
        }),
        partiallyUpdateRequest: builder.mutation<Order, { publicOrderId: string; publicRequestId: string; data: Partial<OrderRequest> }>({
            query: ({ publicOrderId, publicRequestId, data }) => ({
                url: `orders/${publicOrderId}/requests/${publicRequestId}`,
                method: 'patch',
                data,
            }),
            invalidatesTags: [{ type: 'Requests', id: 'LIST' }],
            onQueryStarted(arg, { queryFulfilled, dispatch }) {
                queryFulfilled.then(() => {
                    dispatch(orderRequestsApi.util.invalidateTags([{ type: 'Requests', id: 'LIST' }]));
                });
            },
        }),
        createRequest: builder.mutation<OrderRequest, { orderId: string; data: Partial<OrderRequestCreateArg> }>({
            query: ({ orderId, data }) => ({
                url: `orders/${orderId}/requests`,
                method: 'post',
                data,
            }),
            invalidatesTags: [
                { type: 'Requests', id: 'LIST' },
                { type: 'Loadboard', id: 'LIST' },
            ],
        }),
    }),
});

export const { useCreateRequestMutation, useGetRequestsQuery, usePartiallyUpdateRequestMutation } = orderRequestsApi;
