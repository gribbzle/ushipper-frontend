import React from 'react';

import { FiltersCurrentSearch } from '@/components/common/filters-current-search/filters-current-search';
import { CatalogFiltersValue } from '@store/client/catalogs/types';
import { translateByNamespace } from '@utils/i18n';

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
