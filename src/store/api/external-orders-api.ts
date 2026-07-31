import { Attachment } from '@/shared';
import { ParsedOrderData } from '@store/client/loadboard';
import { Load } from '@store/common/orders/types';

import { apiSlice } from './api-slice';

export type ExternalOfferValues = {
    assignedDriverId: string;
    externalAssignedDriverId: string;
    note: string;
};

export const externalOrdersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getExternalOrders: builder.query<ParsedOrderData, string>({
            query: publicId => {
                return {
                    url: `orders/${publicId}/external-orders`,
                    method: 'get',
                };
            },
            providesTags: (_response, _error, publicId) => [{ type: 'Loadboard', id: publicId }],
            transformResponse: (response: { data: ParsedOrderData }) => response.data,
        }),
        getExternalContracts: builder.query<Attachment, { publicOrderId: string; externalOrderId: string }>({
            query: ({ publicOrderId, externalOrderId }) => {
                return {
                    url: `orders/${publicOrderId}/external-orders/${externalOrderId}/contract`,
                    method: 'get',
                };
            },
            transformResponse: (response: { data: Attachment }) => response.data,
        }),
        createAcceptExternalContract: builder.mutation<ParsedOrderData, { publicOrderId: string; externalOrderId: string; assignedDriverId?: string }>({
            query: ({ publicOrderId, externalOrderId, assignedDriverId }) => {
                return {
                    url: `orders/${publicOrderId}/external-orders/${externalOrderId}/contract/accept`,
                    method: 'post',
                    ...(assignedDriverId && { data: { assignedDriverId } }),
                };
            },
            transformResponse: (response: { data: ParsedOrderData }) => response.data,
        }),
        createImportExternalContract: builder.mutation<Load, { publicOrderId: string; assignedDriverId?: string }>({
            query: ({ publicOrderId, assignedDriverId }) => {
                return {
                    url: `orders/${publicOrderId}/external-orders/import`,
                    method: 'post',
                    ...(assignedDriverId && { data: { assignedDriverId } }),
                };
            },
            transformResponse: (response: { data: Load }) => response.data,
        }),
        getExternalOffers: builder.query<ParsedOrderData, string>({
            query: publicId => {
                return {
                    url: `orders/${publicId}/external-offers`,
                    method: 'get',
                };
            },
            providesTags: (_response, _error, publicId) => [{ type: 'Loadboard', id: publicId }],
            transformResponse: (response: { data: ParsedOrderData }) => response.data,
        }),
        createAcceptExternalOffer: builder.mutation<Load, { publicOrderId: string; externalOfferId: string; data?: Partial<ExternalOfferValues> }>({
            query: ({ publicOrderId, externalOfferId, data }) => {
                return {
                    url: `orders/${publicOrderId}/external-offers/${externalOfferId}/accept`,
                    method: 'post',
                    data,
                };
            },
            transformResponse: (response: { data: Load }) => response.data,
        }),
    }),
});

export const {
    useGetExternalOrdersQuery,
    useGetExternalContractsQuery,
    useLazyGetExternalOrdersQuery,
    useLazyGetExternalOffersQuery,
    useCreateAcceptExternalContractMutation,
    useCreateImportExternalContractMutation,
    useCreateAcceptExternalOfferMutation,
} = externalOrdersApi;
