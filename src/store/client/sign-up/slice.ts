import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { composeBuilder, requestInitial, RequestStatus } from '@utils';

import { fetchSignUpConfigAction, requestUSDOTVerifyFormSubmit, signUpFormSubmit } from './actions';
import { SignUpSliceState } from './types';

const initialState: SignUpSliceState = {
    signUpFormSubmit: requestInitial(),
    signUpConfirmation: {
        status: RequestStatus.NONE,
        code: null,
    },
    requestUSDOTVerifyFormSubmit: requestInitial(),
    fetchSignUpConfig: requestInitial(),
};

const signInSlice = createSlice({
    name: 'signUp',
    initialState,
    reducers: {
        setSignUpConfirmationInfo: (state, action: PayloadAction<SignUpSliceState['signUpConfirmation']>) => {
            state.signUpConfirmation = action.payload;
        },
    },
    extraReducers: builder =>
        composeBuilder(builder, [signUpFormSubmit, requestUSDOTVerifyFormSubmit, fetchSignUpConfigAction]).addCase(HYDRATE, (state, action: AnyAction) => {
            return {
                ...state,
                ...action.payload.client.signUp,
            };
        }),
});

export const signUpActions = signInSlice.actions;

export const signUpReducer = signInSlice.reducer;
