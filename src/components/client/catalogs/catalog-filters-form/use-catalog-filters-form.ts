import { useCallback, useEffect, useRef } from 'react';
import { FormApi } from 'final-form';

import { CatalogSortingNameEnum } from '@/enums/catalog-sorting-name-enum';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { useAppDispatch, useAppSelector } from '@store';
import { catalogsIsAllFiltersResetSelector, catalogsSelectedFiltersSelector } from '@store/client';
import { catalogsSliceActions } from '@store/client/catalogs/slice';

import { useCatalogFiltersTabs } from '../catalog-filters-tabs';

import { CatalogFiltersFormState } from './catalog-filters-form.types';

export const useCatalogFiltersForm = () => {
    const dispatch = useAppDispatch();

    const isAllFiltersReset = useAppSelector(catalogsIsAllFiltersResetSelector);
    const filters = useAppSelector(catalogsSelectedFiltersSelector);

    const formRef = useRef<FormApi<CatalogFiltersFormState>>();
    const initialFiltersRef = useRef({
        orderName: CatalogSortingNameEnum.CREATED_AT,
        orderDirection: OrderSortingDirection.ASC,
    });

    const { onFiltersFormChange } = useCatalogFiltersTabs();

    useEffect(() => {
        if (formRef.current && isAllFiltersReset) {
            formRef.current.initialize({});
        }
    }, [isAllFiltersReset]);

    useEffect(() => {
        if (formRef.current) {
            const { change } = formRef.current;

            Object.entries(filters).forEach(([key, value]) => {
                if (!value) {
                    change(key, Array.isArray(value) ? [] : undefined);
                }
            });
        }
    }, [filters]);

    const handleFiltersChange = useCallback(
        (values: CatalogFiltersFormState) => {
            dispatch(catalogsSliceActions.setIsAllFiltersReset(false));

            onFiltersFormChange(values);
        },
        [onFiltersFormChange, dispatch],
    );

    return { handleFiltersChange, initialFiltersRef, formRef };
};
