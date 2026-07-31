import { OrderSortingName } from '@enums';
import { AdminFormOrdersFilters } from '@types';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import { AdminOrdersFiltersFormState } from './admin-orders-filters.types';

export const getAdminOrdersFiltersFromFormValue = ({ sortBy, ...others }: AdminOrdersFiltersFormState): AdminFormOrdersFilters => {
    const filters: AdminFormOrdersFilters = {
        ...others,
        orderName: sortBy?.[0]?.value as OrderSortingName,
        orderDirection: sortBy?.[1]?.value,
    };

    return getObjectWithoutEmptyFields(filters);
};
