import { createSlice } from '@reduxjs/toolkit';

import { OrderBOL, orderBolApi } from '@store/api/order-bol-api';

type OrderBolSliceState = {
    data: OrderBOL | null;
};

const orderBOLSlice = createSlice({
    name: 'orderBOL',
    initialState: {
        data: null,
    } as OrderBolSliceState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(orderBolApi.endpoints.getOrderBol.matchFulfilled, (state, { payload }) => {
            state.data = payload;
        });
    },
});

export const orderBOLReducer = orderBOLSlice.reducer;
