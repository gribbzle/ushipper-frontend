import { CreateFinancialAccountValues, FinancialBalanceData, FinancialBalanceFilters, UpdateFinancialBalanceValues } from '@store/admin';
import { CursorPagination, PaginatedResponse } from '@utils/redux';

import { apiSlice } from './api-slice';

export const balancesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getBalances: builder.query<CursorPagination<FinancialBalanceData[]>, Partial<FinancialBalanceFilters>>({
            query: params => ({
                url: 'balances',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: CursorPagination<FinancialBalanceData[]> }) => response.data,
            providesTags: [{ type: 'FinancialBalances', id: 'LIST' }],
        }),
        getBalancesWithPaginate: builder.query<PaginatedResponse<FinancialBalanceData[]>, Partial<FinancialBalanceFilters>>({
            query: params => ({
                url: 'balances',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<FinancialBalanceData[]> }) => response.data,
            providesTags: [{ type: 'FinancialBalances', id: 'LIST' }],
        }),
        getBalance: builder.query<FinancialBalanceData, string>({
            query: id => ({
                url: `balances/${id}`,
                method: 'get',
            }),
            transformResponse: (response: { data: FinancialBalanceData }) => response.data,
            providesTags: result => [{ type: 'FinancialBalances', id: result?.publicId }],
        }),
        createFinancialAccount: builder.mutation<FinancialBalanceData, CreateFinancialAccountValues>({
            query: data => ({
                url: 'balances',
                method: 'post',
                data,
            }),
            transformResponse: (response: { data: FinancialBalanceData }) => response.data,
        }),
        partiallyUpdateBalance: builder.mutation<FinancialBalanceData, { balancePublicId: string; data: UpdateFinancialBalanceValues }>({
            query: ({ balancePublicId, data }) => ({
                url: `balances/${balancePublicId}`,
                method: 'patch',
                data,
            }),
            invalidatesTags: result => [
                { type: 'FinancialBalances', id: 'LIST' },
                { type: 'FinancialBalances', id: result?.publicId },
            ],
        }),
        deleteBalance: builder.mutation<void, string>({
            query: publicId => ({
                url: `balances/${publicId}`,
                method: 'delete',
            }),
            invalidatesTags: [{ type: 'FinancialBalances', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetBalancesQuery,
    useGetBalancesWithPaginateQuery,
    useGetBalanceQuery,
    useCreateFinancialAccountMutation,
    usePartiallyUpdateBalanceMutation,
    useDeleteBalanceMutation,
    useLazyGetBalancesQuery,
    useLazyGetBalanceQuery,
} = balancesApi;
