import { CatalogListTabsEnum, CatalogSortingNameEnum, OrderSortingDirection } from '@/enums';
import { BaseCatalogFiltersParams } from '@store/client';

import { CategoryFields } from '../../profile-settings';
import { CatalogFiltersFormState } from '../catalog-filters-form';

export type CatalogFiltersForUrlParams = Partial<{
    statisticsStatus: CatalogListTabsEnum;
    page: number;
    orderName: CatalogSortingNameEnum;
    orderDirection: OrderSortingDirection;
    ratings: number[];
    specializations: number[];
    categories: number[];
    country: string;
    dispatchFees: number[];
    languages: string[];
    name: string;
}>;

export type CatalogFiltersValue = Omit<BaseCatalogFiltersParams, 'perPage'> &
    Partial<{
        statisticsStatus: CatalogListTabsEnum;
        orderName: CatalogSortingNameEnum;
        orderDirection: OrderSortingDirection;
        page: number;
    }> &
    Omit<CatalogFiltersFormState, keyof CategoryFields | 'sortBy'>;
