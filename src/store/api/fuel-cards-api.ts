import { FuelCardStatus } from '@/enums/fuel/fuel-card-status-enum';
import { FuelTransactionStatus } from '@/enums/fuel/fuel-transaction-status-enum';
import { FuelCard, FuelTransaction } from '@store/admin';
import { PaginatedResponse } from '@utils/redux';

import { apiSlice } from './api-slice';

type BaseFuelParams = {
    orderName: string;
    orderDirection: string;
    page: number;
    perPage: number;
    lastPage: number;
};

export type GetFuelCardParams = BaseFuelParams & {
    number: string;
    accountId: string;
    statuses: FuelCardStatus[];
    companyName: string;
};

export type UpdateFuelCardValues = {
    accountId: string | null;
    limit: number | null;
    limitDef: number | null;
    status: FuelCardStatus;
};

export type GetFuelTransactionsParams = BaseFuelParams & {
    cardId: number;
    accountId: string;
    statuses?: FuelTransactionStatus[];
};

export type UpdateFuelTransactionValues = {
    status: FuelTransactionStatus;
};

export const fuelCardsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFuelCard: builder.query<FuelCard, number>({
            query: fuelCardId => ({
                url: `fuel-cards/${fuelCardId}`,
                method: 'get',
            }),
            transformResponse: (response: { data: FuelCard }) => response.data,
        }),
        getFuelCards: builder.query<PaginatedResponse<FuelCard[]>, Partial<GetFuelCardParams>>({
            query: params => ({
                url: 'fuel-cards',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<FuelCard[]> }) => response.data,
            providesTags: [{ type: 'FuelCards', id: 'LIST' }],
        }),
        partiallyUpdateFuelCard: builder.mutation<FuelCard, { fuelCardId: number; data: Partial<UpdateFuelCardValues> }>({
            query: ({ fuelCardId, data }) => ({
                url: `fuel-cards/${fuelCardId}`,
                method: 'patch',
                data,
            }),
        }),
        getFuelTransactions: builder.query<PaginatedResponse<FuelTransaction[]>, Partial<GetFuelTransactionsParams>>({
            query: params => ({
                url: 'fuel-card-transactions',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<FuelTransaction[]> }) => response.data,
            providesTags: [{ type: 'FuelTransactions', id: 'LIST' }],
        }),
        getFuelTransaction: builder.query<FuelTransaction, number>({
            query: transactionId => ({
                url: `fuel-card-transactions/${transactionId}`,
                method: 'get',
            }),
            transformResponse: (response: { data: FuelTransaction }) => response.data,
        }),
        partiallyUpdateFuelTransaction: builder.mutation<FuelCard, { transactionId: number; data: UpdateFuelTransactionValues }>({
            query: ({ transactionId, data }) => ({
                url: `fuel-card-transactions/${transactionId}`,
                method: 'patch',
                data,
            }),
            invalidatesTags: [{ type: 'FuelTransactions', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetFuelCardQuery,
    useLazyGetFuelCardQuery,
    useGetFuelCardsQuery,
    useLazyGetFuelCardsQuery,
    usePartiallyUpdateFuelCardMutation,
    useGetFuelTransactionsQuery,
    useGetFuelTransactionQuery,
    usePartiallyUpdateFuelTransactionMutation,
} = fuelCardsApi;
