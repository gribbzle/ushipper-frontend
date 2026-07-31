import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import * as blackListApi from '../../../api/black-list-items';
import { translateByNamespace } from '../../../utils/i18n';

import { blackListItemsFiltersSelector, createEditBlackListItemModalModeSelector } from './selectors';
import { CreateEditBlackListItemData, FetchedBlackListItems, TBlackListItemsFilters } from './types';

const notificationsT = translateByNamespace('common:black-list-page:notifications');

export const fetchBlackListItemsAction = createAsyncThunk<FetchedBlackListItems, void>(
    'blackList/fetchBlackListItems',
    async (_data, { rejectWithValue, getState, dispatch }) => {
        const state = getState() as any;
        const filters = blackListItemsFiltersSelector(state) as TBlackListItemsFilters;

        try {
            const result = await blackListApi.fetchBlackListItems(filters);

            dispatch({
                type: 'blackList/setFilters',
                payload: {
                    lastPage: result.meta.lastPage,
                    to: result.meta.to,
                    from: result.meta.from,
                    total: result.meta.total,
                },
            });

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const createEditBlackListItemFormSubmit = createAsyncThunk<void, CreateEditBlackListItemData>(
    'blackList/createEditBlackListItemFormSubmit',
    async (data, { rejectWithValue, dispatch, getState }) => {
        const state = getState() as any;
        const mode = createEditBlackListItemModalModeSelector(state);

        try {
            const result = await blackListApi.createEditBlackListItem(mode as 'create' | 'edit', data);

            toast.success(notificationsT<string>(`${mode === 'create' ? 'created' : 'updated'}-successfully`));
            dispatch({ type: 'blackList/setCreateEditModalProps', payload: { isVisible: false, mode: null, blackListPublicId: null } });

            dispatch(fetchBlackListItemsAction());

            return result;
        } catch (error) {
            toast.error(notificationsT<string>('update-failed'));

            return rejectWithValue(error);
        }
    },
);

export const fetchBlackListItemAction = createAsyncThunk<any, string>('blackList/fetchBlackListItem', async (blackListPublicId, { rejectWithValue }) => {
    try {
        return await blackListApi.fetchBlackListItem(blackListPublicId);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteBlackListItemAction = createAsyncThunk<any, string>(
    'blackList/deleteBlackListItem',
    async (blackListPublicId, { rejectWithValue, dispatch }) => {
        try {
            const result = await blackListApi.deleteBlackListItem(blackListPublicId);

            dispatch({ type: 'blackList/setDeleteBlackListItemPopupProps', payload: { isVisible: false, blackListPublicId: null, blackListName: null } });
            dispatch({ type: 'blackList/setCreateEditModalProps', payload: { isVisible: false, blackListPublicId: null, mode: null } });
            dispatch(fetchBlackListItemsAction());

            toast(notificationsT<string>('deleted-successfully'));

            return result;
        } catch (error) {
            toast.error(notificationsT<string>('delete-failed'));

            return rejectWithValue(error);
        }
    },
);
