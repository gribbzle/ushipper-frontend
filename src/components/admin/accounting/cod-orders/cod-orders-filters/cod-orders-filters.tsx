import React from 'react';

import { AdminOrdersFilters } from '@/components/common/orders-page-layout/admin-orders-filters/admin-orders-filters';

import { useCODOrdersFilters } from './use-cod-orders-filters';

export const CODOrdersFilters = () => {
    const { initialValues, onFilterChange } = useCODOrdersFilters();

    return <AdminOrdersFilters initialFilters={initialValues} onFiltersChange={onFilterChange} />;
};
