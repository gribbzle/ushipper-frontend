import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderSortingDirection } from '@/enums';
import { composeBuilder, requestInitial } from '@utils';

import { createEditUserFormSubmit, deleteUserAction, fetchUserAction, fetchUserRolesAction } from './actions';
import { AssignDrawerState, CreateEditModalState, DeleteUserPopupState, StaffFilters, StaffSliceState } from './types';

const filtersInitialState = {
    name: null,
    phone: null,
    email: null,
    roleId: null,
    status: null,
    companyName: null,
    orderName: 'name',
    orderDirection: OrderSortingDirection.ASC,
    page: 1,
    perPage: 20,
    lastPage: null,
    roleGroup: null,
    excludeRoleGroup: null,
    roleType: null,
    superiorUserPublicId: null,
    superiorsForRoleId: null,
};

const initialState: StaffSliceState = {
    fetchUserRoles: requestInitial(),
    filters: { ...filtersInitialState },

    createEditUserFormSubmit: requestInitial(),
    fetchUser: requestInitial(),
    createEditModal: {
        isVisible: false,
        mode: null,
        userId: null,
    },

    deleteUserPopup: {
        isVisible: false,
        userId: null,
        userName: null,
    },
    assignDrawer: {
        isVisible: false,
        roleName: null,
        superiorUserPublicId: null,
        userName: null,
    },
    deleteUser: requestInitial(),
};

const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        setCreateEditModalProps: (state, action: PayloadAction<CreateEditModalState>) => {
            state.createEditModal = action.payload;
        },
        clearFilters: state => {
            state.filters = { ...filtersInitialState };
        },
        setFilters: (state, action: PayloadAction<Partial<StaffFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setDeleteUserPopupProps: (state, action: PayloadAction<DeleteUserPopupState>) => {
            state.deleteUserPopup = action.payload;
        },
        resetStateSlice: () => {
            return { ...initialState };
        },
        openAssignDrawer: (state, action: PayloadAction<Pick<AssignDrawerState, 'roleName' | 'superiorUserPublicId' | 'userName'>>) => {
            state.assignDrawer = {
                isVisible: true,
                ...action.payload,
            };
        },
        closeAssignDrawer: state => {
            state.assignDrawer = {
                isVisible: false,
                roleName: null,
                superiorUserPublicId: null,
                userName: null,
            };
        },
    },
    extraReducers: builder => composeBuilder(builder, [fetchUserRolesAction, createEditUserFormSubmit, fetchUserAction, deleteUserAction]),
});

export const staffActions = staffSlice.actions;

export const staffReducer = staffSlice.reducer;
