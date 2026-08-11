import { toast } from 'react-toastify';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createUpdateCarMaker, deleteCarMaker, fetchCarMaker, fetchCarMakers } from '@api/car-makers';
import { composeBuilder, requestInitial } from '@utils/redux';

import { carMakersFiltersSelector, createEditCarMakerDrawerPropsSelector, deleteCarMakerPopupPropsSelector } from './selectors';
import { CarMakersFilters, CarMakersSettingsSliceState, CreateEditCarMakerDrawerState, DeleteCarMakerPopupState } from './types';

const initialState: CarMakersSettingsSliceState = {
    fetchCarMakers: requestInitial(),
    filters: {
        page: 1,
        perPage: 20,
        lastPage: null,
        name: null,
        orderName: null,
        orderDirection: null,
        status: null,
    },

    createEditCarMakerDrawer: {
        isVisible: false,
        mode: null,
        carMakerId: null,
        carMakerName: null,
    },
    createUpdateCarMaker: requestInitial(),
    fetchCarMaker: requestInitial(),

    deleteCarMakerPopup: {
        isVisible: false,
        carMakerId: null,
        carMakerName: null,
    },
    deleteCar: requestInitial(),
};

export const fetchCarMakersAction = createAsyncThunk<any, void>('carMakersSettings/fetchCarMakers', async (_data, { rejectWithValue, getState, dispatch }) => {
    const state = getState() as any;
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
            const state = getState() as any;
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
    const state = getState() as any;
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

const carMakersSettingsSlice = createSlice({
    name: 'carMakersSettings',
    initialState,
    reducers: {
        setCreateEditCarMakerDrawerProps: (state, action: PayloadAction<CreateEditCarMakerDrawerState>) => {
            state.createEditCarMakerDrawer = action.payload;
        },
        setDeleteCarMakerPopupProps: (state, action: PayloadAction<DeleteCarMakerPopupState>) => {
            state.deleteCarMakerPopup = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<CarMakersFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
    },
    extraReducers: builder => composeBuilder(builder, [fetchCarMakersAction, fetchCarMakerAction, deleteCarMakerAction]),
});

export const carMakersSettingsActions = carMakersSettingsSlice.actions;

export const carMakersSettingsReducer = carMakersSettingsSlice.reducer;
