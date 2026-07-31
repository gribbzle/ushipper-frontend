import { CompanyType, OrderSortingDirection } from '@/enums';
import { Review } from '@store/client/review/types';
import { PaginatedResponse } from '@utils/redux';

import { apiSlice } from './api-slice';

export type ReviewItem = {
    id: number;
    title: string;
};

export type ReviewAspect = {
    itemId: number;
    rating: number;
};

export type ReviewFormValues = {
    rating: number;
    comment?: string;
    items?: ReviewAspect[];
};

type GetReviewItemsParams = {
    companyId?: string;
    orderId?: string;
    companyType?: CompanyType;
};

type ReviewStoreRequest = {
    orderId: string;
} & ReviewFormValues;

type ReviewUpdateRequest = {
    reviewId: string;
} & ReviewFormValues;

export type GetReviewData = Partial<{
    page: number;
    perPage: number;
    orderDirection: OrderSortingDirection;
    hasOrderRequests: number;
}>;

export const reviewApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReviewItems: builder.query<ReviewItem[], GetReviewItemsParams>({
            query: params => ({
                url: 'reviews/items',
                method: 'GET',
                params,
            }),
            transformResponse: (response: { data: ReviewItem[] }) => response.data,
        }),
        createReview: builder.mutation<Review, ReviewStoreRequest>({
            query: data => ({
                url: 'reviews',
                method: 'post',
                data,
            }),
            invalidatesTags: [
                { type: 'Orders', id: 'LIST' },
                { type: 'Reviews', id: 'LIST' },
            ],
            transformResponse: (response: { data: Review }) => response.data,
        }),
        updateReview: builder.mutation<Review, ReviewUpdateRequest>({
            query: ({ reviewId, ...data }) => ({
                url: `reviews/${reviewId}`,
                method: 'patch',
                data,
            }),
            invalidatesTags: [
                { type: 'Orders', id: 'LIST' },
                { type: 'Reviews', id: 'LIST' },
            ],
            transformResponse: (response: { data: Review }) => response.data,
        }),
        getReviews: builder.query<PaginatedResponse<Review[]>, GetReviewData>({
            query: filters => {
                return {
                    url: 'reviews',
                    method: 'get',
                    params: filters,
                };
            },
            providesTags: result =>
                result
                    ? [...result.data.map(({ publicId }) => ({ type: 'Reviews' as const, id: publicId })), { type: 'Reviews', id: 'LIST' }]
                    : [{ type: 'Reviews', id: 'LIST' }],
            transformResponse: (response: { data: PaginatedResponse<Review[]> }) => response.data,
        }),
    }),
});

export const { useLazyGetReviewItemsQuery, useCreateReviewMutation, useUpdateReviewMutation, useGetReviewsQuery } = reviewApi;
