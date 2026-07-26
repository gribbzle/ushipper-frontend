import React from 'react';

export type FiltersCurrentSearchProps<T> = {
    filters: T;
    onResetFilter: (prop: string) => void;
    onResetAllFilters: () => void;
    filterPropsList: string[];
    getFilterLabel: (prop: string) => string;
    getFilterValue: (prop: string, filters: T) => React.ReactElement | string;
};
