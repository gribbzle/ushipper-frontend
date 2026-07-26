import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { composeBuilder, requestInitial } from '@utils';

import { deleteCarMakerAction, fetchCarMakerAction, fetchCarMakersAction } from './actions';
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
