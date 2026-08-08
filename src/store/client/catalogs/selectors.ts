import { CatalogFiltersValue, CatalogsSliceState } from './types';
import { AppState } from "@store";

export const catalogsSelector = (state: AppState): CatalogsSliceState => state.client.catalogs;

export const catalogsSelectedFiltersSelector = (state: AppState): CatalogFiltersValue => catalogsSelector(state)?.selectedFilters;

export const catalogsIsAllFiltersResetSelector = (state: AppState): boolean => catalogsSelector(state)?.isAllFiltersReset;
