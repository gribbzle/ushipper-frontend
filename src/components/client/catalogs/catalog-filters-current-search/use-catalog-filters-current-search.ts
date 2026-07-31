import React, { useCallback, useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { catalogsSelectedFiltersSelector } from '@store/client/catalogs/selectors';
import { catalogsSliceActions } from '@store/client/catalogs/slice';
import { CatalogFiltersValue } from '@store/client/catalogs/types';
import { specializationByIdSelector } from '@store/common';
import { translateByNamespace } from '@utils/i18n';
import { getTransportServiceTranslate } from '@utils/specialization';

import { SpecializationsFilter } from '../catalog-filters-form/catalog-filters-form.types';

const t = translateByNamespace('client:catalogs.filters');
const tSelected = translateByNamespace('client:loadboard-filters');
const tLanguages = translateByNamespace('common:languages');
const tDispatchFee = translateByNamespace('client:catalogs.filters.dispatch-fee-labels');

const propsList = ['ratings', 'specializations', 'specializationsCategories', 'dispatchFees', 'country', 'languages', 'name'] as const;

export const useCatalogFiltersCurrentSearch = () => {
    const filters = useAppSelector(catalogsSelectedFiltersSelector);
    const dispatch = useAppDispatch();

    const specializationIds = (filters['specializations'] as SpecializationsFilter[]) ?? [];
    const specialization = useAppSelector(specializationByIdSelector(specializationIds[0]?.id));

    const getFilterValue = (prop: string, filters: CatalogFiltersValue): React.ReactElement | string => {
        const handlers = new Map<string, () => React.ReactElement | string>([
            [
                'ratings',
                () => {
                    const rating = filters['ratings'];

                    return rating && rating.length
                        ? rating.length > 1
                            ? `${rating.length} ${tSelected('selected')}`
                            : t(`rating-labels.${rating[0].to}`)
                        : '';
                },
            ],
            [
                'specializations',
                () => {
                    const specializationField = filters['specializations'];

                    if (specializationField && specializationField.length) {
                        if (specializationField.length > 1) {
                            return `${specializationField.length} ${tSelected('selected')}`;
                        }
                        if (specialization) {
                            return getTransportServiceTranslate(specialization.name);
                        }
                    }

                    return '';
                },
            ],
            [
                'specializationsCategories',
                () => {
                    const totalCategoriesCount =
                        filters['specializations']?.reduce((total: number, { categories }: SpecializationsFilter) => total + (categories?.length || 0), 0) || 0;

                    return totalCategoriesCount > 0 ? `${totalCategoriesCount} ${tSelected('selected')}` : '';
                },
            ],
            [
                'languages',
                () => {
                    const languages = filters['languages'];

                    return languages && languages.length
                        ? languages.length > 1
                            ? `${languages.length} ${tSelected('selected')}`
                            : tLanguages(`${languages[0]}`)
                        : '';
                },
            ],
            [
                'dispatchFees',
                () => {
                    const dispatchFeeField = filters['dispatchFees'];

                    return dispatchFeeField && dispatchFeeField.length
                        ? dispatchFeeField.length > 1
                            ? `${dispatchFeeField.length} ${tSelected('selected')}`
                            : tDispatchFee(`${dispatchFeeField[0].to ?? 'infinity'}`)
                        : '';
                },
            ],
        ]);

        const handler = handlers.get(prop);

        if (handler) {
            return handler();
        }

        const filterValue = filters[prop as keyof CatalogFiltersValue];

        return filterValue ? `${filterValue}` : '';
    };

    const onResetFilter = useCallback(
        (prop: string) => {
            if (prop === 'specializationsCategories') {
                const newSpecializations = filters.specializations.map((specialization: SpecializationsFilter) => ({
                    ...specialization,
                    categories: [],
                }));

                dispatch(catalogsSliceActions.setSelectedFilters({ ...filters, ['specializations']: newSpecializations }));
            } else {
                dispatch(catalogsSliceActions.setSelectedFilters({ ...filters, [prop]: undefined }));
            }
        },
        [dispatch, filters],
    );

    const onResetAllFilters = useCallback(() => {
        dispatch(catalogsSliceActions.setIsAllFiltersReset(true));
        dispatch(catalogsSliceActions.setSelectedFilters({}));
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(catalogsSliceActions.setIsAllFiltersReset(true));
            dispatch(catalogsSliceActions.setSelectedFilters({}));
        };
    }, [dispatch]);

    return { onResetAllFilters, onResetFilter, getFilterValue, propsList, filters };
};
