import { useMemo } from 'react';

import { CarriersCatalogListTabsEnum } from '@/enums';
import { useAppSelector } from '@store';
import { useGetCarriersCatalogQuery, useGetCarriersCatalogStatisticQuery } from '@store/api/catalogs-api';
import { CarriersCatalogStatistic, catalogsSelectedFiltersSelector } from '@store/client';
import { transformCatalogFiltersForQuery } from '@utils/catalogs/transform-catalog-filters-for-query';
import { numberWithCommas } from '@utils/numbers';

export const useCarriersCatalogPage = () => {
    const filters = useAppSelector(catalogsSelectedFiltersSelector);

    const { data: carriersResponse, isSuccess: isCarriersResponseSuccess } = useGetCarriersCatalogQuery(transformCatalogFiltersForQuery(filters));

    const carriersStatsResponseWithFilters = useGetCarriersCatalogStatisticQuery({ ...filters, type: 'carrier' });

    const carriersStatsResponseWithoutFilters = useGetCarriersCatalogStatisticQuery({ type: 'carrier' });

    const carriersStats = useMemo<CarriersCatalogStatistic>(() => {
        if (!carriersStatsResponseWithFilters.data || !carriersStatsResponseWithoutFilters.data) {
            return {
                [CarriersCatalogListTabsEnum.HAS_ACCEPTED_JOB_OFFER]: 0,
                [CarriersCatalogListTabsEnum.FLAGGED]: 0,
                [CarriersCatalogListTabsEnum.HAS_NEW_JOB_OFFER]: 0,
                [CarriersCatalogListTabsEnum.ALL]: 0,
            };
        }

        return {
            ...carriersStatsResponseWithoutFilters.data.counters,
            [CarriersCatalogListTabsEnum.ALL]: carriersStatsResponseWithFilters.data.counters.all,
        };
    }, [carriersStatsResponseWithFilters.data, carriersStatsResponseWithoutFilters.data]);

    const totalCarriersCount = useMemo(() => numberWithCommas(carriersStats.all), [carriersStats.all]);

    return { carriersStats, totalCarriersCount, carriersResponse, isCarriersResponseSuccess };
};
