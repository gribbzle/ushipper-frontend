import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { composeBuilder, requestInitial } from '@utils/redux';

import { createEditContactFormSubmit, deleteContactAction, fetchContactAction, fetchContactsAction } from './actions';
import { ContactsFilters, ContactsSliceState, CreateEditContactModalState, DeleteContactPopupState } from './types';

const filtersInitialState = {
    search: null,
    orderName: 'name',
    orderDirection: OrderSortingDirection.ASC,
    page: 1,
    perPage: 20,
    lastPage: null,
};

const initialState: ContactsSliceState = {
    fetchContacts: requestInitial(),
    createEditContactFormSubmit: requestInitial(),
    fetchContact: requestInitial(),

    filters: { ...filtersInitialState },
    createEditModal: {
        isVisible: false,
        mode: null,
        contactId: null,
    },

    deleteContactPopup: {
        isVisible: false,
        contactId: null,
        contactName: null,
    },
    deleteContact: requestInitial(),
};

const contactsSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        setCreateEditModalProps: (state, action: PayloadAction<CreateEditContactModalState>) => {
            state.createEditModal = action.payload;
        },
        setDeleteContactPopupProps: (state, action: PayloadAction<DeleteContactPopupState>) => {
            state.deleteContactPopup = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<ContactsFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: state => {
            state.filters = { ...filtersInitialState };
        },
        resetStateSlice: () => {
            return { ...initialState };
        },
    },
    extraReducers: builder => composeBuilder(builder, [createEditContactFormSubmit, fetchContactsAction, fetchContactAction, deleteContactAction]),
});

export const contactsActions = contactsSlice.actions;

export const contactsReducer = contactsSlice.reducer;
