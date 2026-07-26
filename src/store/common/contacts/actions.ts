import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { createEditContact, deleteContact, fetchContact, fetchContacts } from '@api';
import { AppState } from '@store';

import { translateByNamespace } from '../../../utils/i18n';

import { createEditContactModalModeSelector } from './selectors';
import { contactsFiltersSelector } from './selectors';
import { contactsActions } from './slice';
import { Contact, ContactsFilters, CreateEditContactData, FetchedContacts } from './types';

const t = translateByNamespace('common:contact-actions');

export const createEditContactFormSubmit = createAsyncThunk<void, CreateEditContactData>(
    'contacts/createEditContactFormSubmit',
    async (data, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as AppState;
            const mode = createEditContactModalModeSelector(state);
            const result = await createEditContact(mode as 'create' | 'edit', data);

            toast(`${t('text-success-message')} ${mode === 'create' ? 'created' : 'updated'}`);
            dispatch(contactsActions.setCreateEditModalProps({ isVisible: false, mode: null, contactId: null }));

            dispatch(fetchContactsAction());

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchContactsAction = createAsyncThunk<FetchedContacts, void>('contacts/fetchContacts', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as AppState;
    const filters = contactsFiltersSelector(state) as ContactsFilters;

    try {
        const result = await fetchContacts(filters);

        dispatch(contactsActions.setFilters({ lastPage: result.lastPage, to: result.to, from: result.from, total: result.total }));

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const fetchContactAction = createAsyncThunk<Contact, number>('contacts/fetchContact', async (contactId, { rejectWithValue }) => {
    try {
        return await fetchContact(contactId);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteContactAction = createAsyncThunk<Contact, number>('contact/deleteContact', async (contactId, { rejectWithValue, dispatch }) => {
    try {
        const result = await deleteContact(contactId);

        dispatch(contactsActions.setDeleteContactPopupProps({ isVisible: false, contactId: null, contactName: null }));
        dispatch(contactsActions.setCreateEditModalProps({ isVisible: false, contactId: null, mode: null }));
        dispatch(fetchContactsAction());

        toast(t<string>('text-deleted-success-message'));

        return result;
    } catch (error) {
        toast.error(t<string>('text-error-message'));

        return rejectWithValue(error);
    }
});
