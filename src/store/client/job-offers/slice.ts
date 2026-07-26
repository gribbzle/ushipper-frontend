import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { JobOffersSliceState, SendJobOfferDrawerPropsState } from './types';

const initialState: JobOffersSliceState = {
    sendJobOfferDrawerProps: {
        isDrawerOpened: false,
        id: null,
        to: null,
        jobOffer: null,
    },
};

const jobOffersSlice = createSlice({
    name: 'jobOffers',
    initialState,
    reducers: {
        setSendJobOfferDrawerProps: (state, action: PayloadAction<SendJobOfferDrawerPropsState>) => {
            state.sendJobOfferDrawerProps = action.payload;
        },
    },
});

export const { setSendJobOfferDrawerProps } = jobOffersSlice.actions;

export const jobOffersReducer = jobOffersSlice.reducer;
