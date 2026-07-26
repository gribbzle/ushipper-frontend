import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CashOutTransactionPopupPropsState, WalletSliceState } from './types';

const initialState: WalletSliceState = {
    cashOutTransactionPopupProps: {
        isPopupOpened: false,
    },
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setCashOutTransactionPopupProps: (state, action: PayloadAction<CashOutTransactionPopupPropsState>) => {
            state.cashOutTransactionPopupProps = action.payload;
        },
    },
});

export const walletActions = walletSlice.actions;

export const walletReducer = walletSlice.reducer;
