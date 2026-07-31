import { CatalogFiltersValue } from './types';
type AppState = {
    client: {
        catalogs: any;
    };
};

import { CatalogsSliceState } from './types';

export const catalogsSelector = (state: AppState): CatalogsSliceState => state.client.catalogs;

export const catalogsSelectedFiltersSelector = (state: AppState): CatalogFiltersValue => catalogsSelector(state)?.selectedFilters;

export const catalogsIsAllFiltersResetSelector = (state: AppState): boolean => catalogsSelector(state)?.isAllFiltersReset;
