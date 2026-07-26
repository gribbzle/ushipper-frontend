import { createSlice } from '@reduxjs/toolkit';

import { composeBuilder, requestInitial } from '@utils';

import { requestResetFormSubmit, resetPasswordFormSubmit } from './actions';

const initialState = {
    requestResetFormSubmit: requestInitial(),
    resetPasswordFormSubmit: requestInitial(),
};

const passwordRecoverySlice = createSlice({
    name: 'passwordRecovery',
    initialState,
    reducers: {},
    extraReducers: builder => composeBuilder(builder, [requestResetFormSubmit, resetPasswordFormSubmit]),
});

export const signInActions = passwordRecoverySlice.actions;

export const passwordRecoveryReducer = passwordRecoverySlice.reducer;
