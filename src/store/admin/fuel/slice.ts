import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
    AddFuelCardToDriverPopupPropsState,
    EditFuelCardPopupPropsState,
    FuelSliceState,
    FuelTransactionDetailsDrawerPropsState,
    UnassignDriverFromFuelCardPopupPropsState,
} from './types';

const initialState: FuelSliceState = {
    addFuelCardToDriverPopupProps: {
        isPopupOpened: false,
        fuelCard: null,
    },
    unassignDriverFromFuelCardPopupProps: {
        isPopupOpened: false,
        fuelCard: null,
    },
    editFuelCardPopupProps: {
        isPopupOpened: false,
        fuelCard: null,
        isLoading: false,
    },
    fuelTransactionDetailsDrawerProps: {
        isPopupOpened: false,
        fuelTransaction: null,
    },
};

const fuelSlice = createSlice({
    name: 'fuel',
    initialState,
    reducers: {
        setFuelCardToDriverPopupProps: (state, action: PayloadAction<AddFuelCardToDriverPopupPropsState>) => {
            state.addFuelCardToDriverPopupProps = action.payload;
        },
        setUnassignDriverFromFuelCardPopupProps: (state, action: PayloadAction<UnassignDriverFromFuelCardPopupPropsState>) => {
            state.unassignDriverFromFuelCardPopupProps = action.payload;
        },
        setEditFuelCardPopupProps: (state, action: PayloadAction<Partial<EditFuelCardPopupPropsState>>) => {
            state.editFuelCardPopupProps = { ...state.editFuelCardPopupProps, ...action.payload };
        },
        setFuelTransactionDetailsDrawerProps: (state, action: PayloadAction<FuelTransactionDetailsDrawerPropsState>) => {
            state.fuelTransactionDetailsDrawerProps = action.payload;
        },
    },
});

export const fuelActions = fuelSlice.actions;

export const fuelReducer = fuelSlice.reducer;
