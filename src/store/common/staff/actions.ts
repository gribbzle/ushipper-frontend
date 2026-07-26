import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { createEditUser, deleteUser, fetchRoles, fetchUser } from '@api';
import { AppState } from '@store';
import { selectedAccountSelector } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { accountsApi } from '@store/api/accounts-api';
import { usersApi } from '@store/api/users-api';
import { getErrors } from '@utils';

import { translateByNamespace } from '../../../utils/i18n';

import { createEditUserModalModeSelector, fetchedUserSelector } from './selectors';
import { staffActions } from './slice';
import { CreateEditUserData, UserRole } from './types';

type ErrorResponseData = {
    errors?: Record<string, string[]>;
    message?: string;
};

const staffT = translateByNamespace('common:create-edit-user-drawer');

export const fetchUserRolesAction = createAsyncThunk<UserRole[], string | undefined>('staff/fetchUserRoles', async (companyPublicId, { rejectWithValue }) => {
    try {
        return await fetchRoles(companyPublicId);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const createEditUserFormSubmit = createAsyncThunk<void, CreateEditUserData>(
    'staff/createEditUserFormSubmit',
    async (data, { rejectWithValue, dispatch, getState }) => {
        const state = getState() as AppState;
        const mode = createEditUserModalModeSelector(state);

        try {
            const fetchedUser = fetchedUserSelector(state);

            const result = await createEditUser(mode as 'create' | 'edit', data, !!fetchedUser?.avatar && !data.avatar);

            dispatch(staffActions.setCreateEditModalProps({ isVisible: false, mode: null, userId: null }));
            dispatch(usersApi.util.invalidateTags([{ type: 'Users', id: 'LIST' }]));

            toast.success(staffT<string>(`${mode === 'create' ? 'created' : 'updated'}-successfully`));

            return result;
        } catch (error) {
            const err = error as AxiosError<ErrorResponseData>;
            const defaultMessage = staffT<string>(`${mode === 'create' ? 'created' : 'updated'}-error`);
            let message = err.response?.data?.message;

            if (err?.response?.status === 422) {
                const res = getErrors({ payload: { response: err?.response } });

                if (Object.keys(res).length > 0) {
                    message = Object.values(res).join(', ');
                }
            }

            parseAndShowAxiosError({ data: { message } }, defaultMessage);

            return rejectWithValue(error);
        }
    },
);

export const fetchUserAction = createAsyncThunk<any, string>('staff/fetchUser', async (userPublicId, { rejectWithValue }) => {
    try {
        return await fetchUser(userPublicId);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteUserAction = createAsyncThunk<any, { userPublicId: string; isAccountContext?: boolean }>(
    'staff/deleteUser',
    async ({ userPublicId, isAccountContext = false }, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as AppState;
            const account = selectedAccountSelector(state);

            const result = await deleteUser(userPublicId);

            dispatch(staffActions.setDeleteUserPopupProps({ isVisible: false, userId: null, userName: null }));
            dispatch(staffActions.setCreateEditModalProps({ isVisible: false, userId: null, mode: null }));

            if (account) {
                dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: account.publicId }]));
            }

            if (isAccountContext) {
                dispatch(accountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
            } else {
                dispatch(usersApi.util.invalidateTags([{ type: 'Users', id: 'LIST' }]));
            }

            toast.success(staffT<string>('deleted-successfully'));

            return result;
        } catch (error) {
            toast.error(staffT<string>('deleted-error'));

            return rejectWithValue(error);
        }
    },
);
