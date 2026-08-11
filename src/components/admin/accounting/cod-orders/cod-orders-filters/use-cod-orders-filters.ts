import { useCallback, useMemo } from 'react';

import { useHandleFiltersChange } from '@/hooks/filters/use-handle-filters-change';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { AdminFormOrdersFilters } from '@/types/order';
import { convertToStringArray } from '@utils/converter';

export const useCODOrdersFilters = () => {
    const {
        filters: { createdAtFrom, createdAtTo, searchSubject, search, companyPublicId, driverAccountId, dispatchers, instantTermPaymentType },
    } = useQueryFilters<AdminFormOrdersFilters>();

    const handleFiltersChange = useHandleFiltersChange<AdminFormOrdersFilters>({ resetPageOnChange: true });

    const onFilterChange = useCallback(
        (values: AdminFormOrdersFilters) => {
            const { driverAccountId, dispatchers, ...rest } = values;

            const preparedValues: AdminFormOrdersFilters = {
                driverAccountId: convertToStringArray(driverAccountId),
                dispatchers: convertToStringArray(dispatchers),
                ...rest,
            };

            handleFiltersChange(preparedValues, true);
        },
        [handleFiltersChange],
    );

    const initialValues = useMemo(
        (): AdminFormOrdersFilters => ({
            createdAtFrom,
            createdAtTo,
            searchSubject: searchSubject ?? 'order_id',
            search,
            companyPublicId,
            driverAccountId: convertToStringArray(driverAccountId),
            instantTermPaymentType,
            dispatchers: convertToStringArray(dispatchers),
        }),
        [createdAtFrom, createdAtTo, searchSubject, search, companyPublicId, driverAccountId, dispatchers, instantTermPaymentType],
    );

    return {
        initialValues,
        onFilterChange,
    };
};
