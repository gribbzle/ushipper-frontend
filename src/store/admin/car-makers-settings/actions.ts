import { toast } from 'react-toastify';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { createUpdateCarMaker, deleteCarMaker, fetchCarMaker, fetchCarMakers } from '@api';
import { AppState } from '@store';

import { carMakersFiltersSelector, deleteCarMakerPopupPropsSelector } from './selectors';
import { createEditCarMakerDrawerPropsSelector } from './selectors';
import { carMakersSettingsActions } from './slice';
import { CarMakersFilters, DeleteCarMakerPopupState } from './types';

export const fetchCarMakersAction = createAsyncThunk<any, void>('carMakersSettings/fetchCarMakers', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as AppState;
    const filters = carMakersFiltersSelector(state) as CarMakersFilters;

    try {
        const result = await fetchCarMakers(filters);

        dispatch(carMakersSettingsActions.setFilters({ lastPage: result.lastPage, to: result.to, from: result.from, total: result.total }));

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const createEditCarMakerFormSubmit = createAsyncThunk<void, any>(
    'carMakersSettings/createEditCarMakerFormSubmit',
    async (data, { rejectWithValue, getState, dispatch }) => {
        try {
            const state = getState() as AppState;
            const { mode, carMakerId } = createEditCarMakerDrawerPropsSelector(state);

            data.id = carMakerId;

            const result = await createUpdateCarMaker(mode as 'create' | 'edit', data);

            dispatch(fetchCarMakersAction());
            dispatch(
                carMakersSettingsActions.setCreateEditCarMakerDrawerProps({
                    isVisible: false,
                    mode: null,
                    carMakerId: null,
                    carMakerName: null,
                }),
            );

            toast(`Car Maker has been successfully ${mode === 'create' ? 'created' : 'updated'}`);

            return result;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const fetchCarMakerAction = createAsyncThunk<any, number>('carMakersSettings/fetchCarMaker', async (data, { rejectWithValue }) => {
    try {
        return await fetchCarMaker(data);
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const deleteCarMakerAction = createAsyncThunk<any, void>('carMakersSettings/carMaker', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as AppState;
    const { carMakerId } = deleteCarMakerPopupPropsSelector(state) as DeleteCarMakerPopupState;

    try {
        const result = await deleteCarMaker(carMakerId as number);

        dispatch(
            carMakersSettingsActions.setDeleteCarMakerPopupProps({
                isVisible: false,
                carMakerId: null,
                carMakerName: null,
            }),
        );
        dispatch(
            carMakersSettingsActions.setCreateEditCarMakerDrawerProps({
                isVisible: false,
                mode: null,
                carMakerId: null,
                carMakerName: null,
            }),
        );
        dispatch(fetchCarMakersAction());

        toast('Car Maker has been successfully deleted');

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});
