import { CatalogListTabsEnum } from '@/enums';
import { CatalogFiltersForUrlParams } from '@/components/client/catalogs/catalog-filters-tabs/catalog-filters-tabs.types';
import { BaseCatalogFiltersParams } from '@store/client';

const statusToFieldMap = new Map<CatalogListTabsEnum, keyof BaseCatalogFiltersParams>([
    [CatalogListTabsEnum.OFFERED, 'hasJobOffers'],
    [CatalogListTabsEnum.FLAGGED, 'hasFlags'],
    [CatalogListTabsEnum.CONTRACTED, 'hasAcceptedJobOffers'],
    [CatalogListTabsEnum.HAS_NEW_JOB_OFFER, 'hasJobOffers'],
    [CatalogListTabsEnum.HAS_ACCEPTED_JOB_OFFER, 'hasAcceptedJobOffers'],
]);

export const transformCatalogFiltersForQuery = (params: CatalogFiltersForUrlParams) => {
    const { statisticsStatus, ...rest } = params;
    const transformedFilters: BaseCatalogFiltersParams = statisticsStatus === CatalogListTabsEnum.ALL ? { ...rest } : {};

    if (statisticsStatus) {
        const fieldToAdd = statusToFieldMap.get(statisticsStatus);

        if (fieldToAdd) {
            transformedFilters[fieldToAdd] = 1;
        }
    }

    transformedFilters['perPage'] = 10;

    return transformedFilters;
};
