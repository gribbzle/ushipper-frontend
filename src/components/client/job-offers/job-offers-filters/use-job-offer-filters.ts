import { useCallback, useState } from 'react';

import { TabItemBase } from '@/components/common/tabs/tabs';
import { JobOfferSortingName, OfferStatusesEnum, OrderSortingDirection } from '@/enums';
import { useMeCarrier } from '@hooks/use-user-role-group';

import { JobOffersFiltersParams, JobOffersFiltersTypes } from './job-offers-filters.types';

export const useJobOffersFilters = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const isMeCarrier = useMeCarrier();

    const [filters, setFilters] = useState<JobOffersFiltersParams>({
        orderName: JobOfferSortingName.CREATED_AT,
        orderDirection: OrderSortingDirection.DESC,
        type: isMeCarrier ? 'user_to_company' : 'company_to_user',
    });

    const onSelectTab = useCallback(
        (tab: TabItemBase) => {
            let status = undefined;

            if (Object.values(OfferStatusesEnum).includes(tab.value as OfferStatusesEnum)) {
                status = tab.value as OfferStatusesEnum;
            }

            setCurrentPage(1);
            setFilters({
                ...filters,
                status,
            });
        },
        [filters],
    );

    const onChangeFormValue = useCallback(
        (values: JobOffersFiltersTypes) => {
            const newFilters = {
                ...filters,
                orderName: values.sortBy ? (values.sortBy[0].value as JobOfferSortingName) : undefined,
                orderDirection: values.sortBy ? values.sortBy[1].value : undefined,
                searchQuery: values?.search,
                searchSubjects: values?.searchSubjects,
                type: values.type,
            };

            setCurrentPage(1);
            setFilters(newFilters);
        },
        [filters],
    );

    return { filters, onSelectTab, onChangeFormValue, currentPage, setCurrentPage };
};
