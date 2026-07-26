import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AccountData, AccountsSliceState } from './types';

const initialState: AccountsSliceState = {
    accounts: null,
};

const accountsSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setAccounts: (state, action: PayloadAction<AccountData>) => {
            state.accounts = action.payload;
        },
    },
});

export const accountsActions = accountsSlice.actions;

export const accountsReducer = accountsSlice.reducer;
