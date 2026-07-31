import { CreateTransactionFormState } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-form/create-transaction-form.types';
import { BalanceType, TransactionStatusGroupEnum, TransactionTypeGroup } from '@/enums';
import { Transaction } from '@store/admin';
import { apiSlice } from '@store/api/api-slice';
import { CursorPagination, PaginatedResponse } from '@utils/redux';

type UpdateTransactionsParams = Pick<Transaction, 'status' | 'notes' | 'cancellationNotes'>;

export type TransactionsFiltersParams = Partial<{
    balanceId: string;
    balanceType: BalanceType;
    statusGroup: TransactionStatusGroupEnum;
    status: string;
    fundsMovement: string;
    type: string;
    sourceTypeGroup: string;
    destinationTypeGroup: string;
    destinationAccountId: string;
    sourceAccountId: string;
    accountId: string;
    createdAtFrom: string;
    createdAtTo: string;
    reasonUserId: string;
    reasonCompanyId: string;
    orderId: string;
    typeGroup: TransactionTypeGroup;
    perPage: number;
    orderName: string;
    orderDirection: string;
    page: number;
    cursor: string | null;
}>;

export type CustomCreateTransactionError = {
    data: {
        error: 'not_enough_data' | 'invalid_source_or_balance';
        provider: 'masspay';
    };
    message?: string;
};

export const transactionsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createTransaction: builder.mutation<unknown, Omit<CreateTransactionFormState, 'type'>>({
            query: data => ({
                url: 'transactions',
                method: 'post',
                data,
            }),
        }),
        updateTransaction: builder.mutation<Transaction, { publicId: string; data: Partial<UpdateTransactionsParams> }>({
            query: ({ publicId, data }) => ({
                url: `transactions/${publicId}`,
                method: 'patch',
                data,
            }),
            invalidatesTags: result => [
                { type: 'Transactions', id: 'LIST' },
                { type: 'Transactions', id: result?.publicId },
            ],
        }),
        getTransactions: builder.query<PaginatedResponse<Transaction[]>, Partial<TransactionsFiltersParams>>({
            query: params => {
                return {
                    url: 'transactions',
                    method: 'GET',
                    params,
                };
            },
            transformResponse: (response: { data: PaginatedResponse<Transaction[]> }) => response.data,
            providesTags: [{ type: 'Transactions', id: 'LIST' }],
        }),
        getTransactionsWithCursor: builder.query<CursorPagination<Transaction[]>, Partial<TransactionsFiltersParams>>({
            query: ({ cursor, ...params }) => {
                return {
                    url: 'transactions',
                    method: 'GET',
                    params: { ...params, cursor },
                };
            },
            serializeQueryArgs: ({ queryArgs, endpointName }) => {
                const { cursor, ...rest } = queryArgs;

                return `${endpointName}(${JSON.stringify(rest)})`;
            },
            merge: (currentCache, newItems) => {
                newItems.data.forEach(newItem => {
                    const index = currentCache.data.findIndex(cacheItem => cacheItem.publicId === newItem.publicId);

                    if (index === -1) {
                        currentCache.data.push(newItem);
                    } else {
                        currentCache.data[index] = newItem;
                    }
                });
                currentCache.meta.nextCursor = newItems.meta.nextCursor;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            transformResponse: (response: { data: CursorPagination<Transaction[]> }) => response.data,
            providesTags: [{ type: 'Transactions', id: 'LIST' }],
        }),
    }),
});

export const { useCreateTransactionMutation, useUpdateTransactionMutation, useGetTransactionsQuery, useGetTransactionsWithCursorQuery } = transactionsApi;
