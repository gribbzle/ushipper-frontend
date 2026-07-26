import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import * as loadboardApi from '@/api/loadboard';
import { AppState } from '@store';
import { loadboardActions } from '@store/client/loadboard/slice';
import { CreateSearchPayload, RemoveSearchPayload, UpdateSearchPayload } from '@store/client/loadboard/types';
import { translateByNamespace } from '@utils';

const t = (key: string) => translateByNamespace('client:loadboard-filters')(key);

export const createLoadboardSearch = createAsyncThunk<loadboardApi.SavedLoadboardSearch, CreateSearchPayload>(
    'loadboard/createLoadboardSearch',
    async (payload, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as AppState;
            const result = await loadboardApi.createLoadBoardSearch(payload.name, payload.filters);

            dispatch(
                loadboardActions.setSavedLoadBoardSearches({
                    searches: [...state.client.loadboard.savedSearches.searches, result],
                }),
            );

            toast.success(t('search-created-toast'));

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const updateLoadboardSearch = createAsyncThunk<loadboardApi.SavedLoadboardSearch, UpdateSearchPayload>(
    'loadboard/updateLoadboardSearch',
    async (payload, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as AppState;
            const result = await loadboardApi.updateLoadboardSearch(payload.id, payload.name, payload.filters);
            const searches = state.client.loadboard.savedSearches.searches;

            dispatch(
                loadboardActions.setSavedLoadBoardSearches({
                    searches: searches.map(search => (search.publicId === result.publicId ? result : search)),
                }),
            );

            toast.success(t('search-updated-toast'));

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const removeLoadboardSearch = createAsyncThunk<void, RemoveSearchPayload>(
    'loadboard/removeLoadboardSearch',
    async (payload, { rejectWithValue, dispatch, getState }) => {
        try {
            const state = getState() as AppState;
            const searches = state.client.loadboard.savedSearches.searches;

            await loadboardApi.removeLoadboardSearch(payload.id);

            dispatch(
                loadboardActions.setSavedLoadBoardSearches({
                    searches: searches.filter(search => search.publicId !== payload.id),
                }),
            );
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getLoadboardSearches = createAsyncThunk<void, void>('loadboard/getLoadboardSearches', async (payload, { rejectWithValue, dispatch }) => {
    try {
        const res = await loadboardApi.getLoadboardSavedSearches({ page: 1, perPage: 100 });

        dispatch(
            loadboardActions.setSavedLoadBoardSearches({
                searches: res.data,
            }),
        );
    } catch (error) {
        return rejectWithValue(error);
    }
});
