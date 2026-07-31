import { useMemo } from 'react';

import { useJobOffersFilters } from '@/components/client/job-offers/job-offers-filters/use-job-offer-filters';
import { OffersListTabsEnum } from '@/enums';
import { useGetJobOffersQuery, useGetJobOffersStatisticQuery } from '@store/api/job-offers';
import { OffersStatistic } from '@store/api/order-offers';
import { translateByNamespace } from '@utils/i18n';

import { useUserRoleGroup } from '../use-user-role-group';

const filtersTranslate = translateByNamespace('client:order-offers:filters');
const t = translateByNamespace('client:job-offers-page');

export const useJobOffers = () => {
    const userRoleGroup = useUserRoleGroup();
    const { filters, onSelectTab, onChangeFormValue, currentPage, setCurrentPage } = useJobOffersFilters();

    const { data: jobOffersResponse, isSuccess: isJobOffersResponseSuccess } = useGetJobOffersQuery({
        page: currentPage,
        perPage: 20,
        ...filters,
    });

    const jobOffersStatsResponse = useGetJobOffersStatisticQuery({
        searchQuery: filters.searchQuery,
        searchSubjects: filters.searchSubjects,
        type: filters.type,
    });

    const jobOffersStats = useMemo<OffersStatistic>(() => {
        if (!jobOffersStatsResponse.data) {
            return {
                [OffersListTabsEnum.New]: 0,
                [OffersListTabsEnum.Accepted]: 0,
                [OffersListTabsEnum.Declined]: 0,
                [OffersListTabsEnum.Canceled]: 0,
                [OffersListTabsEnum.All]: 0,
            };
        }

        return jobOffersStatsResponse.data.statusCounters;
    }, [jobOffersStatsResponse]);

    const emptyTitle = useMemo(() => {
        const status = filters.status ? filtersTranslate(`${filters.status}`) : '';

        return t(`${userRoleGroup}-empty-title`, { status });
    }, [filters, userRoleGroup]);

    const emptySubTitle = useMemo(() => t(`${userRoleGroup}-empty-sub-title`), [userRoleGroup]);

    return {
        emptyTitle,
        emptySubTitle,
        jobOffersStats,
        jobOffersResponse,
        isJobOffersResponseSuccess,
        currentPage,
        setCurrentPage,
        filters,
        onSelectTab,
        onChangeFormValue,
    };
};
