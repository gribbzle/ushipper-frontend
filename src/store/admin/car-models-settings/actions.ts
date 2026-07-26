import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { OrderSortingDirection } from '@/enums';
import { createEditCarModel, deleteCarModel, fetchCarMakers, fetchCarModel, fetchCarModels, fetchCarModelStatuses } from '@api';
import { AppState } from '@store';
import { CarMaker } from '@store/admin';
import { PaginatedData } from '@utils';

import { carModelsFiltersSelector, createEditCarModelDrawerPropsSelector, deleteCarModelPopupPropsSelector } from './selectors';
import { carModelsSettingsActions } from './slice';
import { CarModelsFilters, DeleteCarModelPopupState } from './types';

export const fetchCarModelsAction = createAsyncThunk<any, void>('carModelsSettings/fetchCarModels', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as AppState;
    const filters = carModelsFiltersSelector(state) as CarModelsFilters;

    try {
        const result = await fetchCarModels(filters);

        dispatch(carModelsSettingsActions.setFilters({ lastPage: result.lastPage, to: result.to, from: result.from, total: result.total }));

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const createEditCarModelFormSubmit = createAsyncThunk<void, any>(
    'carModelsSettings/createEditCarModelFormSubmit',
    async (data, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState() as AppState;
            const { mode, carModelId } = createEditCarModelDrawerPropsSelector(state);

            data.id = carModelId;

            const result = await createEditCarModel(mode as 'create' | 'edit', data);

            dispatch(fetchCarModelsAction());
            dispatch(
                carModelsSettingsActions.setCreateEditCarModelDrawerProps({
                    isVisible: false,
                    mode: null,
                    carModelId: null,
                    carModelName: null,
                }),
            );

            toast(`Car Model has been successfully ${mode === 'create' ? 'created' : 'updated'}`);

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchCarModelAction = createAsyncThunk<any, number>('carModelsSettings/fetchCarModel', async (data, { rejectWithValue }) => {
    try {
        return await fetchCarModel(data);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteCarModelAction = createAsyncThunk<any, void>('carModelsSettings/deleteCarModel', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as AppState;
    const { carModelId } = deleteCarModelPopupPropsSelector(state) as DeleteCarModelPopupState;

    try {
        const result = await deleteCarModel(carModelId as number);

        dispatch(
            carModelsSettingsActions.setDeleteCarModelPopupProps({
                isVisible: false,
                carModelId: null,
                carModelName: null,
            }),
        );
        dispatch(
            carModelsSettingsActions.setCreateEditCarModelDrawerProps({
                isVisible: false,
                mode: null,
                carModelId: null,
                carModelName: null,
            }),
        );
        dispatch(fetchCarModelsAction());

        toast('Car Model has been successfully deleted');

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const crudSearchCarMakersAction = createAsyncThunk<any, string | null>(
    'carModelsSettings/crudSearchCarMakers',
    async (searchQuery, { rejectWithValue }) => {
        try {
            return await fetchCarMakers({
                page: 1,
                name: searchQuery,
                perPage: 20,
                lastPage: null,
                orderDirection: OrderSortingDirection.ASC,
                orderName: 'name',
                status: 'active',
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const filterSearchCarMakersAction = createAsyncThunk<PaginatedData<CarMaker[]>, string | null>(
    'carModelsSettings/filterSearchCarMakers',
    async (searchQuery, { rejectWithValue }) => {
        try {
            return await fetchCarMakers({
                page: 1,
                name: searchQuery,
                perPage: 20,
                lastPage: null,
                orderDirection: OrderSortingDirection.ASC,
                orderName: 'name',
                status: null,
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchCarModelStatusesAction = createAsyncThunk<any, void>('carModelsSettings/fetchCarModelStatuses', async (searchQuery, { rejectWithValue }) => {
    try {
        return await fetchCarModelStatuses();
    } catch (error) {
        return rejectWithValue(error);
    }
});
