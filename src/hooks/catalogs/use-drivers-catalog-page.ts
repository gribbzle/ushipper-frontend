import { useMemo } from 'react';

import { DispatcherCatalogListTabsEnum } from '@/enums';
import { useAppSelector } from '@store';
import { useGetDriversCatalogQuery, useGetDriversCatalogStatisticQuery } from '@store/api/catalogs-api';
import { DispatcherCatalogStatistic } from '@store/client';
import { catalogsSelectedFiltersSelector } from '@store/client/catalogs/selectors';
import { transformCatalogFiltersForQuery } from '@utils/catalogs/transform-catalog-filters-for-query';
import { numberWithCommas } from '@utils/numbers';

export const useDriversCatalogPage = () => {
    const filters = useAppSelector(catalogsSelectedFiltersSelector);

    const { data: driversResponse, isSuccess: isDriversResponseSuccess } = useGetDriversCatalogQuery(transformCatalogFiltersForQuery(filters));

    const driversStatsResponseWithFilters = useGetDriversCatalogStatisticQuery(filters);

    const driversStatsResponseWithoutFilters = useGetDriversCatalogStatisticQuery(null);

    const driversStats = useMemo<DispatcherCatalogStatistic>(() => {
        if (!driversStatsResponseWithFilters.data || !driversStatsResponseWithoutFilters.data) {
            return {
                [DispatcherCatalogListTabsEnum.CONTRACTED]: 0,
                [DispatcherCatalogListTabsEnum.FLAGGED]: 0,
                [DispatcherCatalogListTabsEnum.OFFERED]: 0,
                [DispatcherCatalogListTabsEnum.ALL]: 0,
            };
        }

        return {
            ...driversStatsResponseWithoutFilters.data.counters,
            [DispatcherCatalogListTabsEnum.ALL]: driversStatsResponseWithFilters.data.counters.all,
        };
    }, [driversStatsResponseWithoutFilters.data, driversStatsResponseWithFilters.data]);

    const totalDriversCount = useMemo(() => numberWithCommas(driversStats.all), [driversStats.all]);

    return { driversStats, totalDriversCount, driversResponse, isDriversResponseSuccess };
};
