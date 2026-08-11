import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchSignUpConfig, signUp } from '@api/common';
import { usdotVerify } from '@api/usdot';

import { SignUpConfig, SignUpFormData } from './types';

export const signUpFormSubmit = createAsyncThunk<void, SignUpFormData>('signUp/signUpFormSubmit', async (data, { rejectWithValue }) => {
    try {
        return await signUp(data);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const requestUSDOTVerifyFormSubmit = createAsyncThunk<void, { usDotNumber: string }>(
    'signUp/requestUSDOTVerifyFormSubmit',
    async (data, { rejectWithValue }) => {
        try {
            return await usdotVerify(data.usDotNumber);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchSignUpConfigAction = createAsyncThunk<SignUpConfig, void>('signUp/fetchSignUpConfig', async (data, { rejectWithValue }) => {
    try {
        return await fetchSignUpConfig();
    } catch (error) {
        return rejectWithValue(error);
    }
});
