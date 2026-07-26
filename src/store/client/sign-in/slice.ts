import { createSlice } from '@reduxjs/toolkit';

import { composeBuilder, requestInitial } from '@utils';

import { signInFormSubmit } from './actions';

const initialState = {
    signInFormSubmit: requestInitial(),
};

const signInSlice = createSlice({
    name: 'signIn',
    initialState,
    reducers: {},
    extraReducers: builder => composeBuilder(builder, [signInFormSubmit]),
});

export const signInActions = signInSlice.actions;

export const signInReducer = signInSlice.reducer;
