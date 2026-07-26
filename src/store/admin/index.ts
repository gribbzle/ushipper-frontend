import { Action, combineReducers } from '@reduxjs/toolkit';

import { accountingReducer } from './accounting';
import { carMakersSettingsReducer } from './car-makers-settings';
import { carModelsSettingsReducer } from './car-models-settings';
import { companiesReducer } from './companies';
import { fuelReducer } from './fuel';

export * from './accounting';
export * from './car-makers-settings';
export * from './car-models-settings';
export * from './companies';
export * from './fuel';

type AdminState = {
    accounting: ReturnType<typeof accountingReducer>;
    carMakersSettings: ReturnType<typeof carMakersSettingsReducer>;
    carModelsSettings: ReturnType<typeof carModelsSettingsReducer>;
    companies: ReturnType<typeof companiesReducer>;
    fuel: ReturnType<typeof fuelReducer>;
};

export const adminReducer = combineReducers<AdminState, Action>({
    accounting: accountingReducer,
    carMakersSettings: carMakersSettingsReducer,
    carModelsSettings: carModelsSettingsReducer,
    companies: companiesReducer,
    fuel: fuelReducer,
});
