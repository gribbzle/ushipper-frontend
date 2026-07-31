import { CatalogListTabsEnum, CatalogSortingNameEnum, OrderSortingDirection } from '@/enums';

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
