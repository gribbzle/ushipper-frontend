import { useCallback, useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { FiltersCurrentSearchProps } from './filters-current-search.types';

export function useFiltersCurrentSearch<T extends Record<string, any>>({
    filters,
    onResetFilter,
    filterPropsList,
    getFilterLabel,
    getFilterValue,
}: Omit<FiltersCurrentSearchProps<T>, 'onResetAllFilters'>) {
    const filterNames = useMemo(() => {
        return filterPropsList.reduce((acc: Record<string, string>, prop) => {
            acc[prop] = getFilterLabel(toKebabCase(prop));

            return acc;
        }, {} as Record<string, string>);
    }, [filterPropsList, getFilterLabel]);

    const filtersHaveValue = useMemo(() => filterPropsList.some(prop => getFilterValue(prop, filters)), [filters, filterPropsList, getFilterValue]);

    const resetFilterValue = useCallback(
        (prop: string) => {
            onResetFilter(prop);
        },
        [onResetFilter],
    );

    return { resetFilterValue, filtersHaveValue, filterNames };
}
