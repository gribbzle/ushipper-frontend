import { createAsyncThunk } from '@reduxjs/toolkit';

import { requestResetPassword, resetPassword } from '@api';

import { RequestResetPasswordData, ResetPasswordData } from './types';

export const requestResetFormSubmit = createAsyncThunk<void, RequestResetPasswordData>(
    'passwordRecovery/requestResetFormSubmit',
    async (data, { rejectWithValue }) => {
        try {
            await requestResetPassword(data);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const resetPasswordFormSubmit = createAsyncThunk<void, ResetPasswordData>(
    'passwordRecovery/resetPasswordFormSubmit',
    async (data, { rejectWithValue }) => {
        try {
            await resetPassword(data);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
