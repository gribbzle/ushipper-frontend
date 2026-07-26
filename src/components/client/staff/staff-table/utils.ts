import { ReadonlyURLSearchParams } from 'next/navigation';

import { OrderSortingDirection } from '@/enums';
import { StaffFilters } from '@store/client';

export const getUserFiltersFromUrlParams = (params: ReadonlyURLSearchParams, defaultFilters: Partial<StaffFilters> = {}): Partial<StaffFilters> => {
    const filters: Partial<StaffFilters> = { ...defaultFilters };

    filters.name = params.get('name');
    filters.phone = params.get('phone');
    filters.email = params.get('email');
    filters.roleId = params.get('roleId') ? Number(params.get('roleId')) : undefined;
    filters.status = params.get('status');
    filters.companyName = params.get('companyName');
    filters.orderName = params.get('orderName') || 'name';
    filters.orderDirection = params.get('orderDirection') || OrderSortingDirection.ASC;
    filters.page = Number(params.get('page')) || 1;
    filters.perPage = params.get('perPage') ? Number(params.get('perPage')) : undefined;

    return filters;
};
