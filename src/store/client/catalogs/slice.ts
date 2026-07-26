import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CatalogFiltersValue } from '@components';

import { CatalogsSliceState } from './types';

const initState: CatalogsSliceState = {
    selectedFilters: {},
    isAllFiltersReset: false,
};

const catalogsSlice = createSlice({
    name: 'catalogs',
    initialState: initState,
    reducers: {
        setSelectedFilters: (state, action: PayloadAction<CatalogFiltersValue>) => {
            state.selectedFilters = action.payload;
        },
        setIsAllFiltersReset: (state, action: PayloadAction<boolean>) => {
            state.isAllFiltersReset = action.payload;
        },
    },
});

export const catalogsSliceActions = catalogsSlice.actions;

export const catalogsReducer = catalogsSlice.reducer;
