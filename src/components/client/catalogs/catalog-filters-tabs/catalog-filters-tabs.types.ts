import { CatalogListTabsEnum } from '@/enums/catalog-list-tabs-enum';
import { CatalogSortingNameEnum } from '@/enums/catalog-sorting-name-enum';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';

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
