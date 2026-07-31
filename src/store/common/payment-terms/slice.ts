import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { composeBuilder } from '@utils/redux';

import { PaymentTerm, PaymentTermsSliceState } from './types';

const initialState: PaymentTermsSliceState = {
    paymentTerms: [],
};

const paymentTermsSlice = createSlice({
    name: 'paymentTerms',
    initialState,
    reducers: {
        setPaymentTerms: (state, action: PayloadAction<PaymentTerm[]>) => {
            state.paymentTerms = action.payload;
        },
    },
    extraReducers: builder => composeBuilder(builder, []),
});

export const paymentTermsActions = paymentTermsSlice.actions;

export const paymentTermsReducer = paymentTermsSlice.reducer;
