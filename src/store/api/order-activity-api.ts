import { FundsTransferStatus } from '@/enums/funds-transfer-status';
import { HistoryItemEventName } from '@/enums/history-item-event-name';
import { User } from '@store/common/staff/types';
import { CursorPagination } from '@utils/redux';

import { apiSlice } from './api-slice';

export type FundsTransferPayload = {
    old: FundsTransferStatus;
    new: FundsTransferStatus;
};

export type OrderActivity = {
    eventName: HistoryItemEventName;
    payload: object;
    creator: User | null;
    createdAt: string;
};

type OrderActivityResponse = {
    activities: OrderActivity[];
    nextCursor?: string | null;
};

export const orderActivityApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrderActivity: builder.query<OrderActivityResponse, { orderId: string; cursor?: string }>({
            query: ({ orderId, cursor }) => ({
                url: `orders/${orderId}/history-items`,
                method: 'get',
                params: {
                    orderName: 'created_at',
                    orderDirection: 'desc',
                    perPage: 4,
                    cursor,
                },
            }),
            providesTags: (result, error, arg) => [{ type: 'Orders', id: `Activity-${arg.orderId}` }],
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                currentCache.activities.push(...newItems.activities);
                currentCache.nextCursor = newItems.nextCursor;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            transformResponse: (response: { data: CursorPagination<OrderActivity[]> }) => ({
                activities: response.data.data,
                nextCursor: response.data.meta.nextCursor,
            }),
        }),
    }),
});

export const { useGetOrderActivityQuery } = orderActivityApi;
