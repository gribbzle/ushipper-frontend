import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RequestsSliceState, SendOfferDrawer } from '@store/client/requests/types';

const initState: RequestsSliceState = {
    sendOfferDrawer: {
        isOpen: false,
    },
};

const requestsSlice = createSlice({
    name: 'loadboard',
    initialState: initState,
    reducers: {
        setRequestDrawer: (state, action: PayloadAction<SendOfferDrawer>) => {
            state.sendOfferDrawer = action.payload;
        },
    },
});

export const requestsSliceActions = requestsSlice.actions;

export const requestsSliceReducer = requestsSlice.reducer;
