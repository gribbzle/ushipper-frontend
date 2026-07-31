import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createUpdateRole, deleteRole, fetchRole, fetchRoles, fetchRoleTypes } from '@api';
import { ClickedRowId } from '@components/common/table/table.types';
import { authorizedUserSelector } from '@store/global/selectors';
import { AuthorizedUserInfo } from '@store/global/shared-types';
import { handleError } from '@utils/handle-error';
import { composeBuilder, requestInitial } from '@utils/redux';

import { translateByNamespace } from '../../../utils/i18n';
import { UserRole } from '../staff';

import { createUpdateRoleBlockPropsSelector, deleteRolePopupPropsSelector } from './selectors';
import { CreateUpdateRoleBlockState, DeleteRolePopupState, RolesSettingsSliceState } from './types';

const t = translateByNamespace('common:roles-page');

const initialState: RolesSettingsSliceState = {
    fetchRoles: requestInitial(),

    fetchRoleTypes: requestInitial(),
    createUpdateRoleBlock: {
        mode: 'create',
        roleId: null,
    },
    createUpdateRoleFormSubmit: requestInitial(),
    fetchRole: requestInitial(),

    deleteRolePopup: {
        isVisible: false,
        roleId: null,
        roleName: null,
    },
    deleteRole: requestInitial(),
    clickedRowId: null,
};

export const fetchRolesAction = createAsyncThunk<UserRole[], void>('rolesSettings/fetchRoles', async (_data, { rejectWithValue, getState }) => {
    const state = getState() as any;
    const { companyPublicId } = authorizedUserSelector(state) as AuthorizedUserInfo;

    try {
        return await fetchRoles(companyPublicId);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const fetchRoleTypesAction = createAsyncThunk<UserRole[], void>('rolesSettings/fetchRoleTypes', async (_data, { rejectWithValue }) => {
    try {
        return await fetchRoleTypes();
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const createUpdateRoleFormSubmit = createAsyncThunk<void, any>(
    'rolesSettings/createUpdateRoleFormSubmit',
    async (data, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState() as any;
            const { mode, roleId } = createUpdateRoleBlockPropsSelector(state);

            data.id = roleId;

            const result = await createUpdateRole(mode as 'create' | 'edit', data);
            const resultRoleId = result.data.id;

            dispatch(fetchRolesAction());

            if (mode === 'create' && resultRoleId) {
                dispatch(rolesSettingsActions.setClickedRowId(resultRoleId));
                dispatch(fetchRoleAction(resultRoleId));
                dispatch(rolesSettingsActions.setCreateUpdateRoleBlockProps({ mode: 'edit', roleId: resultRoleId }));
            }

            toast.success<string>(t(`role-success-notification-${mode === 'create' ? 'created' : 'updated'}`));

            return result;
        } catch (error: any) {
            if (error?.response) {
                handleError(error.response);
            } else {
                toast.error<string>(t('text-error-notification'));
            }

            return rejectWithValue(error);
        }
    },
);

export const fetchRoleAction = createAsyncThunk<any, number>('rolesSettings/fetchRole', async (data, { rejectWithValue }) => {
    try {
        return await fetchRole(data);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteRoleAction = createAsyncThunk<any, void>('rolesSettings/deleteRole', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as any;
    const { roleId } = deleteRolePopupPropsSelector(state) as DeleteRolePopupState;
    const createUpdateRoleBlockProps = createUpdateRoleBlockPropsSelector(state) as CreateUpdateRoleBlockState;

    try {
        const result = await deleteRole(roleId as number);

        dispatch(
            rolesSettingsActions.setDeleteRolePopupProps({
                isVisible: false,
                roleId: null,
                roleName: null,
            }),
        );
        if (createUpdateRoleBlockProps.roleId === roleId) {
            dispatch(rolesSettingsActions.resetClickedRowId());
            dispatch(rolesSettingsActions.setCreateUpdateRoleBlockProps({ mode: 'create', roleId: null }));
        }
        dispatch(fetchRolesAction());

        toast.success<string>(t('role-deleted-success-notification'));

        return result;
    } catch (error) {
        toast.error<string>(t('role-deleted-error-notification'));

        return rejectWithValue(error);
    }
});

const rolesSettingsSlice = createSlice({
    name: 'rolesSettings',
    initialState,
    reducers: {
        setCreateUpdateRoleBlockProps: (state, action: PayloadAction<CreateUpdateRoleBlockState>) => {
            state.createUpdateRoleBlock = action.payload;
        },
        setDeleteRolePopupProps: (state, action: PayloadAction<DeleteRolePopupState>) => {
            state.deleteRolePopup = action.payload;
        },
        setClickedRowId(state, action: PayloadAction<ClickedRowId>) {
            state.clickedRowId = action.payload;
        },
        resetClickedRowId(state) {
            state.clickedRowId = null;
        },
    },
    extraReducers: builder => composeBuilder(builder, [fetchRolesAction, fetchRoleTypesAction, createUpdateRoleFormSubmit, fetchRoleAction, deleteRoleAction]),
});

export const rolesSettingsActions = rolesSettingsSlice.actions;

export const rolesSettingsReducer = rolesSettingsSlice.reducer;
