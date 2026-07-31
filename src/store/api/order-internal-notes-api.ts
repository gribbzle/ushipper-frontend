import { User } from '@/store/common/staff/types';
import { CursorPagination } from '@utils/redux';

import { apiSlice } from './api-slice';

export type OrderInternalNoteFormState = {
    text: string;
};

export type OrderInternalNote = {
    publicId: string;
    text: string;
    creator: User;
    createdAt: string;
    updatedAt: string;
};

type OrderInternalNotesResponse = {
    internalNotes: OrderInternalNote[];
    nextCursor?: string | null;
};

export const orderInternalNotesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getOrderInternalNotes: builder.query<OrderInternalNotesResponse, { orderId: string; cursor?: string }>({
            query: ({ orderId, cursor }) => ({
                url: `orders/${orderId}/internal-notes`,
                method: 'get',
                params: {
                    orderName: 'created_at',
                    orderDirection: 'desc',
                    perPage: 2,
                    cursor,
                },
            }),
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName;
            },
            merge: (currentCache, newItems) => {
                currentCache.internalNotes.push(...newItems.internalNotes);
                currentCache.nextCursor = newItems.nextCursor;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            transformResponse: (response: { data: CursorPagination<OrderInternalNote[]> }) => ({
                internalNotes: response.data.data,
                nextCursor: response.data.meta.nextCursor,
            }),
        }),
        createOrderInternalNote: builder.mutation<OrderInternalNote, { orderId: string; text: string }>({
            query: ({ orderId, text }) => ({
                url: `orders/${orderId}/internal-notes`,
                method: 'post',
                data: { text },
            }),
            onQueryStarted({ orderId }, { queryFulfilled, dispatch }) {
                queryFulfilled.then(({ data }) => {
                    dispatch(
                        orderInternalNotesApi.util.updateQueryData('getOrderInternalNotes', { orderId }, draft => {
                            draft.internalNotes.unshift(data);
                        }),
                    );
                });
            },
            transformResponse: (response: { data: OrderInternalNote }) => response.data,
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
        }),
        updateOrderInternalNote: builder.mutation<OrderInternalNote, { orderId: string; internalNoteId: string; text: string }>({
            query: ({ orderId, internalNoteId, text }) => ({
                url: `orders/${orderId}/internal-notes/${internalNoteId}`,
                method: 'patch',
                data: { text },
            }),
            onQueryStarted({ orderId }, { queryFulfilled, dispatch }) {
                queryFulfilled.then(({ data }) => {
                    dispatch(
                        orderInternalNotesApi.util.updateQueryData('getOrderInternalNotes', { orderId }, draft => {
                            draft.internalNotes = draft.internalNotes.map(internalNote => {
                                if (internalNote.publicId == data.publicId) {
                                    return data;
                                }

                                return internalNote;
                            });
                        }),
                    );
                });
            },
            transformResponse: (response: { data: OrderInternalNote }) => response.data,
        }),
        deleteOrderInternalNote: builder.mutation<OrderInternalNote, { orderId: string; internalNoteId: string }>({
            query: ({ orderId, internalNoteId }) => ({
                url: `orders/${orderId}/internal-notes/${internalNoteId}`,
                method: 'delete',
            }),
            onQueryStarted({ orderId, internalNoteId }, { queryFulfilled, dispatch }) {
                queryFulfilled.then(() => {
                    dispatch(
                        orderInternalNotesApi.util.updateQueryData('getOrderInternalNotes', { orderId }, draft => {
                            draft.internalNotes = draft.internalNotes.filter(internalNote => internalNote.publicId !== internalNoteId);
                        }),
                    );
                });
            },
            transformResponse: (response: { data: OrderInternalNote }) => response.data,
        }),
    }),
});

export const { useGetOrderInternalNotesQuery, useCreateOrderInternalNoteMutation, useUpdateOrderInternalNoteMutation, useDeleteOrderInternalNoteMutation } =
    orderInternalNotesApi;
