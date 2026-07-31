import { useCallback, useState } from 'react';

import { TabItemBase } from '@/components/common/tabs/tabs';
import { OfferSortingName, OfferStatusesEnum, OrderSortingDirection } from '@/enums';
import { OffersFiltersParams } from '@store/api/order-offers';

import { OffersFiltersTypes } from './offers-filters.types';

export const useOffersFilters = () => {
    const [filters, setFilters] = useState<OffersFiltersParams>({
        orderName: OfferSortingName.CREATED_AT,
        orderDirection: OrderSortingDirection.DESC,
    });

    const onSelectTab = useCallback(
        (tab: TabItemBase) => {
            let status = undefined;

            if (Object.values(OfferStatusesEnum).includes(tab.value as OfferStatusesEnum)) {
                status = tab.value as OfferStatusesEnum;
            }

            setFilters({
                ...filters,
                status,
            });
        },
        [setFilters, filters],
    );

    const onChangeFormValue = useCallback(
        (values: OffersFiltersTypes) => {
            const newFilters = {
                ...filters,
                orderName: values.sortBy ? (values.sortBy[0].value as OfferSortingName) : OfferSortingName.CREATED_AT,
                orderDirection: values.sortBy ? values.sortBy[1].value : OrderSortingDirection.DESC,
                carrierCompanyId: values?.carrierCompanyId,
                shipperCompanyId: values?.shipperCompanyId,
                searchQuery: values?.search,
                searchSubject: values?.searchSubject,
            };

            setFilters(newFilters);
        },
        [filters],
    );

    return { filters, onSelectTab, onChangeFormValue };
};
