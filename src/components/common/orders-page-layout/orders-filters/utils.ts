import { OrderSortingName } from '@/enums/order-sorting-name';
import { FormOrdersFilters } from '@/types/order';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import { OrdersFiltersFormState } from './orders-filters.types';

export const getFiltersFromFormValue = ({ dispatchers, driverAccountId, search, searchSubject, sortBy }: OrdersFiltersFormState): FormOrdersFilters =>
    getObjectWithoutEmptyFields({
        dispatchers,
        driverAccountId,
        search,
        searchSubject,
        orderName: sortBy?.[0]?.value as OrderSortingName,
        orderDirection: sortBy?.[1]?.value,
    });
