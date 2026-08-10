import { SortSelectValue } from '@/components/common/sort-select/sort-select';
import { CatalogSortingNameEnum } from '@/enums/catalog-sorting-name-enum';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';

import { CategoryFields } from '../../profile-settings';

export type RatingOrDispatchFeeFilter = {
    from: number;
    to: number;
};

export type CategoryFilter = {
    id: number;
};

export type SpecializationsFilter = {
    id: number;
    categories?: CategoryFilter[];
};

export type CatalogFiltersFormState = Partial<{
    ratings: RatingOrDispatchFeeFilter[];
    specializations: SpecializationsFilter[];
    country: string;
    dispatchFees: RatingOrDispatchFeeFilter[];
    languages: string[];
    orderName: CatalogSortingNameEnum;
    orderDirection: OrderSortingDirection;
    sortBy: SortSelectValue;
    name: string;
}> &
    CategoryFields;
