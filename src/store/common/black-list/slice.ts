import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderSortingDirection } from '@/enums/order-sorting-direction';

import { composeBuilder, requestInitial } from '../../../utils/redux';

import { createEditBlackListItemFormSubmit, deleteBlackListItemAction, fetchBlackListItemAction, fetchBlackListItemsAction } from './actions';
import { BlackListSliceState, CreateEditBlackListItemModalState, DeleteBlackListItemPopupState, TBlackListItemsFilters } from './types';

const filtersInitialState = {
    query: null,
    orderName: 'name',
    orderDirection: OrderSortingDirection.ASC,
    page: null, //1,
    perPage: 20,
    lastPage: null,
};

const initialState: BlackListSliceState = {
    fetchBlackListItems: requestInitial(),
    filters: { ...filtersInitialState },

    createEditBlackListItemsFormSubmit: requestInitial(),
    fetchBlackListItem: requestInitial(),
    createEditModal: {
        isVisible: false,
        mode: null,
        blackListPublicId: null,
    },

    deleteBlackListItemPopup: {
        isVisible: false,
        blackListPublicId: null,
        blackListName: null,
    },
    deleteBlackListItem: requestInitial(),
};

const blackListSlice = createSlice({
    name: 'blackList',
    initialState,
    reducers: {
        setCompanyPublicId: (_state, _action: PayloadAction<string | null>) => {
            // state.companyPublicId = action.payload;
        },
        setCreateEditModalProps: (state, action: PayloadAction<CreateEditBlackListItemModalState>) => {
            state.createEditModal = action.payload;
        },
        clearFilters: state => {
            state.filters = { ...filtersInitialState };
        },
        clearFetchBlackListItems: state => {
            state.fetchBlackListItems = requestInitial();
        },
        setFilters: (state, action: PayloadAction<Partial<TBlackListItemsFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setDeleteBlackListItemPopupProps: (state, action: PayloadAction<DeleteBlackListItemPopupState>) => {
            state.deleteBlackListItemPopup = action.payload;
        },
        resetStateSlice: () => {
            return { ...initialState };
        },
    },
    extraReducers: builder =>
        composeBuilder(builder, [fetchBlackListItemsAction, createEditBlackListItemFormSubmit, fetchBlackListItemAction, deleteBlackListItemAction]),
});

export const blackListActions = blackListSlice.actions;

export const blackListReducer = blackListSlice.reducer;
