import { SortSelectValue } from '@/components/common';
import { CatalogSortingNameEnum, OrderSortingDirection } from '@/enums';

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
