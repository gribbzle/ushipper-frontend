import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderReviewPopupState, ReviewReplyDrawerState, ReviewSliceState } from './types';

const initialState: ReviewSliceState = {
    orderReviewPopup: {
        isVisible: false,
        review: null,
        company: null,
    },
    reviewReplyDrawer: {
        isVisible: false,
        initialComment: null,
        companyName: null,
        replyId: null,
        reviewId: null,
    },
};

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        setOrderReviewPopupProps: (state, action: PayloadAction<OrderReviewPopupState>) => {
            state.orderReviewPopup = action.payload;
        },
        setReviewReplyPopupProps: (state, action: PayloadAction<ReviewReplyDrawerState>) => {
            state.reviewReplyDrawer = action.payload;
        },
    },
});

export const reviewActions = reviewSlice.actions;

export const reviewSliceReducer = reviewSlice.reducer;
