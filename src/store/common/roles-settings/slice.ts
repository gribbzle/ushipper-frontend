import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ClickedRowId } from '@components';
import { composeBuilder, requestInitial } from '@utils';

import { createUpdateRoleFormSubmit, deleteRoleAction, fetchRoleAction, fetchRolesAction, fetchRoleTypesAction } from './actions';
import { CreateUpdateRoleBlockState, DeleteRolePopupState, RolesSettingsSliceState } from './types';

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
