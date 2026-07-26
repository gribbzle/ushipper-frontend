import { Fee, FeeData, FeeParams } from '@types';

import { apiSlice } from './api-slice';

const feesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getFees: builder.query<Fee[], FeeParams>({
            query: params => {
                return {
                    url: 'fees',
                    method: 'get',
                    params,
                };
            },
            transformResponse: (response: { data: Fee[] }) => response.data,
        }),
        pathFee: builder.mutation<Fee, FeeData>({
            query: ({ feeId, ...data }) => {
                return {
                    url: `fees/${feeId}`,
                    method: 'patch',
                    data,
                };
            },
        }),
        deleteFee: builder.mutation<void, number>({
            query: feeId => ({
                url: `fees/${feeId}`,
                method: 'delete',
            }),
        }),
        createFee: builder.mutation<Fee, FeeData>({
            query: data => ({
                url: 'fees',
                method: 'post',
                data,
            }),
        }),
    }),
});

export const { useGetFeesQuery, useDeleteFeeMutation, useCreateFeeMutation, usePathFeeMutation } = feesApi;
