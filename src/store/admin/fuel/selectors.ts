type AppState = {
    admin: {
        fuel: any;
    };
};

import {
    AddFuelCardToDriverPopupPropsState,
    EditFuelCardPopupPropsState,
    FuelTransactionDetailsDrawerPropsState,
    UnassignDriverFromFuelCardPopupPropsState,
} from './types';

const fuelSelectors = (state: AppState) => state.admin.fuel;

export const addFuelCardToDriverPopupPropsSelector = (state: AppState): AddFuelCardToDriverPopupPropsState =>
    fuelSelectors(state).addFuelCardToDriverPopupProps;

export const unassignDriverFromFuelCardPopupPropsSelector = (state: AppState): UnassignDriverFromFuelCardPopupPropsState =>
    fuelSelectors(state).unassignDriverFromFuelCardPopupProps;

export const editFuelCardPopupPropsSelector = (state: AppState): EditFuelCardPopupPropsState => fuelSelectors(state).editFuelCardPopupProps;

export const fuelTransactionDetailsDrawerPropsSelector = (state: AppState): FuelTransactionDetailsDrawerPropsState =>
    fuelSelectors(state).fuelTransactionDetailsDrawerProps;
