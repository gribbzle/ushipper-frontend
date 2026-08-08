import { CatalogSortingNameEnum, OrderSortingDirection } from '@/enums';
import { getObjectWithoutEmptyFields } from '@utils/objects';

import { RatingOrDispatchFeeFilter, SpecializationsFilter } from '../catalog-filters-form/catalog-filters-form.types';

import { CatalogFiltersForUrlParams } from './catalog-filters-tabs.types';
import { CatalogFiltersValue } from '@store/client/catalogs/types';

export const getCatalogFiltersForUrlParams = (filters: CatalogFiltersValue): CatalogFiltersForUrlParams => {
    const {
        statisticsStatus,
        page,
        ratings,
        languages,
        name,
        country,
        dispatchFees,
        specializations,
        orderName = CatalogSortingNameEnum.CREATED_AT,
        orderDirection = OrderSortingDirection.ASC,
    } = filters;

    const filterValues: CatalogFiltersForUrlParams = {
        ratings: ratings?.map((val: RatingOrDispatchFeeFilter) => val.to) ?? [],
        dispatchFees: dispatchFees?.map((val: RatingOrDispatchFeeFilter) => val.to ?? 'any') ?? [],
        specializations: specializations?.map((spec: SpecializationsFilter) => spec.id) ?? [],
        categories: specializations?.flatMap((spec: SpecializationsFilter) => (spec.categories ? spec.categories.map(val => val.id) : [])) ?? [],
        page,
        statisticsStatus,
        orderName,
        orderDirection,
        languages,
        country,
        name,
    };

    return getObjectWithoutEmptyFields(filterValues);
};
