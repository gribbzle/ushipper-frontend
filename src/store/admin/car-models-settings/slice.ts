import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { composeBuilder, requestInitial } from '@utils';

import {
    crudSearchCarMakersAction,
    deleteCarModelAction,
    fetchCarModelAction,
    fetchCarModelsAction,
    fetchCarModelStatusesAction,
    filterSearchCarMakersAction,
} from './actions';
import { CarModelsFilters, CarModelsSettingsSliceState, CreateEditCarModelDrawerState, DeleteCarModelPopupState } from './types';

const initialState: CarModelsSettingsSliceState = {
    fetchCarModels: requestInitial(),
    filters: {
        page: 1,
        perPage: 20,
        lastPage: null,
        modelName: null,
        makerId: null,
        status: null,
        orderName: null,
        orderDirection: null,
    },
    filterSearchCarMakers: requestInitial(),
    fetchCarModelStatuses: requestInitial(),

    createEditCarModelDrawer: {
        isVisible: false,
        mode: null,
        carModelId: null,
        carModelName: null,
    },
    createEditCarModel: requestInitial(),
    fetchCarModel: requestInitial(),
    crudSearchCarMakers: requestInitial(),

    deleteCarModelPopup: {
        isVisible: false,
        carModelId: null,
        carModelName: null,
    },
    deleteCarModel: requestInitial(),
};

const carModelsSettingsSlice = createSlice({
    name: 'carModelsSettings',
    initialState,
    reducers: {
        setCreateEditCarModelDrawerProps: (state, action: PayloadAction<CreateEditCarModelDrawerState>) => {
            state.createEditCarModelDrawer = action.payload;
        },
        setDeleteCarModelPopupProps: (state, action: PayloadAction<DeleteCarModelPopupState>) => {
            state.deleteCarModelPopup = action.payload;
        },
        setFilters: (state, action: PayloadAction<Partial<CarModelsFilters>>) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetStateSlice: () => {
            return { ...initialState };
        },
        resetCrudSearchCarMakers: state => {
            state.crudSearchCarMakers = requestInitial();
        },
    },
    extraReducers: builder =>
        composeBuilder(builder, [
            fetchCarModelsAction,
            fetchCarModelAction,
            deleteCarModelAction,
            crudSearchCarMakersAction,
            fetchCarModelStatusesAction,
            filterSearchCarMakersAction,
        ]),
});

export const carModelsSettingsActions = carModelsSettingsSlice.actions;

export const carModelsSettingsReducer = carModelsSettingsSlice.reducer;
