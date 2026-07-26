import { ReviewReply } from '@store/client';

import { apiSlice } from './api-slice';

export const reviewReplyApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createReviewReply: builder.mutation<ReviewReply, { reviewId: string; comment: string }>({
            query: ({ reviewId, comment }) => ({
                url: `reviews/${reviewId}/replies`,
                method: 'post',
                data: { comment },
            }),
            invalidatesTags: ['Reviews'],
            transformResponse: (response: { data: ReviewReply }) => response.data,
        }),
        updateReviewReply: builder.mutation<ReviewReply, { reviewId: string; replyId: string; comment: string }>({
            query: ({ reviewId, replyId, comment }) => ({
                url: `reviews/${reviewId}/replies/${replyId}`,
                method: 'patch',
                data: { comment },
            }),
            invalidatesTags: ['Reviews'],
            transformResponse: (response: { data: ReviewReply }) => response.data,
        }),
    }),
});

export const { useCreateReviewReplyMutation, useUpdateReviewReplyMutation } = reviewReplyApi;
