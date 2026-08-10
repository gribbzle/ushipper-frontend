import { useMemo } from 'react';

import { DispatcherCatalogListTabsEnum } from '@/enums/catalog-list-tabs-enum';
import { useAppSelector } from '@store';
import { useGetDispatchersCatalogQuery, useGetDispatchersCatalogStatisticQuery } from '@store/api/catalogs-api';
import { DispatcherCatalogStatistic } from '@store/client';
import { catalogsSelectedFiltersSelector } from '@store/client/catalogs/selectors';
import { transformCatalogFiltersForQuery } from '@utils/catalogs/transform-catalog-filters-for-query';
import { numberWithCommas } from '@utils/numbers';

export const useDispatchersCatalogPage = () => {
    const filters = useAppSelector(catalogsSelectedFiltersSelector);

    const { data: dispatchersResponse, isSuccess: isDispatchersResponseSuccess } = useGetDispatchersCatalogQuery(transformCatalogFiltersForQuery(filters));

    const dispatchersStatsResponseWithFilters = useGetDispatchersCatalogStatisticQuery(filters);

    const dispatchersStatsResponseWithoutFilters = useGetDispatchersCatalogStatisticQuery(null);

    const dispatchersStats = useMemo<DispatcherCatalogStatistic>(() => {
        if (!dispatchersStatsResponseWithFilters.data || !dispatchersStatsResponseWithoutFilters.data) {
            return {
                [DispatcherCatalogListTabsEnum.CONTRACTED]: 0,
                [DispatcherCatalogListTabsEnum.FLAGGED]: 0,
                [DispatcherCatalogListTabsEnum.OFFERED]: 0,
                [DispatcherCatalogListTabsEnum.ALL]: 0,
            };
        }

        return {
            ...dispatchersStatsResponseWithoutFilters.data.counters,
            [DispatcherCatalogListTabsEnum.ALL]: dispatchersStatsResponseWithFilters.data.counters.all,
        };
    }, [dispatchersStatsResponseWithoutFilters.data, dispatchersStatsResponseWithFilters.data]);

    const totalDispatcherCount = useMemo(() => numberWithCommas(dispatchersStats.all), [dispatchersStats.all]);

    return { dispatchersStats, totalDispatcherCount, dispatchersResponse, isDispatchersResponseSuccess };
};
