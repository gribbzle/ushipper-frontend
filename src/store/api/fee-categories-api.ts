import { CreateEditFeeCategoryFormState } from '@/components/admin/accounting/fee-categories-settings/create-edit-fee-category-block/create-edit-fee-category-block.types';
import { FeeCategory } from '@/types/fee-category';

import { apiSlice } from './api-slice';

const feeCategoriesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFeeCategories: builder.query<FeeCategory[], void>({
            query: params => ({
                url: 'fee-categories',
                params,
            }),
            transformResponse: (response: { data: FeeCategory[] }) => response.data,
            providesTags: [{ type: 'FeeCategories', id: 'LIST' }],
        }),
        partiallyUpdateFeeCategory: builder.mutation<FeeCategory, { feeCategoryId: number; data: CreateEditFeeCategoryFormState }>({
            query: ({ feeCategoryId, data }) => ({
                url: `fee-categories/${feeCategoryId}`,
                method: 'patch',
                data,
            }),
            transformResponse: (response: { data: FeeCategory }) => response.data,
            invalidatesTags: result => [
                { type: 'FeeCategories', id: 'LIST' },
                { type: 'FeeCategories', id: result?.id },
            ],
        }),
        createFeeCategory: builder.mutation<FeeCategory, CreateEditFeeCategoryFormState>({
            query: data => ({
                url: 'fee-categories',
                method: 'post',
                data,
            }),
            transformResponse: (response: { data: FeeCategory }) => response.data,
            invalidatesTags: result => [
                { type: 'FeeCategories', id: 'LIST' },
                { type: 'FeeCategories', id: result?.id },
            ],
        }),
        deleteFeeCategory: builder.mutation<void, number>({
            query: id => ({
                url: `fee-categories/${id}`,
                method: 'delete',
            }),
            invalidatesTags: () => [{ type: 'FeeCategories', id: 'LIST' }],
        }),
    }),
});

export const { useGetFeeCategoriesQuery, usePartiallyUpdateFeeCategoryMutation, useCreateFeeCategoryMutation, useDeleteFeeCategoryMutation } = feeCategoriesApi;
