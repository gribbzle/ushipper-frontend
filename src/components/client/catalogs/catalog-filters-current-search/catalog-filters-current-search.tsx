import React from 'react';

import { FiltersCurrentSearch } from '@/components/common';
import { translateByNamespace } from '@utils';

import { CatalogFiltersValue } from '../catalog-filters-tabs';

import { useCatalogFiltersCurrentSearch } from './use-catalog-filters-current-search';

const t = translateByNamespace('client:catalogs.filters');

export const CatalogFiltersCurrentSearch = () => {
    const { onResetAllFilters, onResetFilter, getFilterValue, propsList, filters } = useCatalogFiltersCurrentSearch();

    return (
        <FiltersCurrentSearch<CatalogFiltersValue>
            filters={filters}
            onResetFilter={onResetFilter}
            onResetAllFilters={onResetAllFilters}
            filterPropsList={[...propsList]}
            getFilterLabel={t}
            getFilterValue={getFilterValue}
        />
    );
};
