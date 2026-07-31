import { ParsedUrlQuery } from 'querystring';

import { getObjectWithoutEmptyFields } from '@utils/objects';

import { StaffFiltersFormState, StaffQueryParams } from './staff-filters.types';

export const getStaffUrlParams = (staffFiltersFormState: StaffFiltersFormState, prevFilters: ParsedUrlQuery): StaffQueryParams => {
    const queryParams: StaffQueryParams = {};

    Object.keys(staffFiltersFormState).forEach(key => {
        const filterKey = key as keyof StaffFiltersFormState;

        queryParams[filterKey] = staffFiltersFormState[filterKey];
    });

    if (typeof prevFilters.orderName === 'string') {
        queryParams.orderName = prevFilters.orderName;
    }
    if (typeof prevFilters.orderDirection === 'string') {
        queryParams.orderDirection = prevFilters.orderDirection;
    }
    if (typeof prevFilters.perPage === 'string') {
        queryParams.perPage = Number(prevFilters.perPage);
    }

    return getObjectWithoutEmptyFields(queryParams);
};
