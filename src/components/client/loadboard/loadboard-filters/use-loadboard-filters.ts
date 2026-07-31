import { useCallback, useEffect, useRef } from 'react';
import { FormApi } from 'final-form';

import { Filters } from '@/components/client/loadboard/loadboard-filters/types';
import { areFiltersEqual } from '@/utils/filters';
import { useHasPartnerCompanies, useIsPartnerCompany, useLoadboard, useMeDispatcher, useMeDriver } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { SavedLoadBoardFilters } from '@store/api/loadboard-api';
import { isSearchAlongRouteSelector, loadboardActions } from '@store/client/loadboard';

import { LoadboardFiltersProps } from './loadboard-filters.types';
import { convertToExternalFilters, convertToInnerFilters, updateLocationFields } from './utils';

export const useLoadboardFilters = ({ filters, filtersChanged }: LoadboardFiltersProps) => {
    const formRef = useRef<FormApi<Filters, Partial<Filters>>>();
    const sentFiltersRef = useRef<SavedLoadBoardFilters>();
    const initialFiltersRef = useRef(convertToInnerFilters(filters));
    const { hasPartnerCompanies } = useHasPartnerCompanies();
    const isMePartner = useIsPartnerCompany();
    const isMeDriver = useMeDriver();
    const isMeDispatcher = useMeDispatcher();
    const dispatch = useAppDispatch();
    const searchRoute = useAppSelector(isSearchAlongRouteSelector);
    const { updateURLFilters } = useLoadboard();

    const showFilterBySource = ((isMeDriver || isMeDispatcher) && hasPartnerCompanies) || isMePartner;

    useEffect(() => {
        const innerFilters = convertToInnerFilters(filters);

        sentFiltersRef.current = filters;
        formRef.current?.initialize(innerFilters);
    }, [filters, dispatch]);

    const updateFilters = useCallback(
        (filters: SavedLoadBoardFilters) => {
            sentFiltersRef.current = filters;

            filtersChanged?.(filters);
        },
        [filtersChanged],
    );

    const handleFiltersChange = useCallback(
        (e: Filters) => {
            const newFilters = convertToExternalFilters(e, searchRoute);

            if (areFiltersEqual(filters, newFilters) || areFiltersEqual(newFilters, sentFiltersRef.current)) {
                return;
            }

            updateFilters(newFilters);
        },
        [searchRoute, filters, updateFilters],
    );

    const onChangeRouteSearch = useCallback(
        (search: boolean) => {
            dispatch(loadboardActions.setIsSearchAlongRoute(search));

            const newFilters = updateLocationFields(filters, search);

            updateFilters(newFilters);
            updateURLFilters(newFilters, search);
        },
        [filters, dispatch, updateURLFilters, updateFilters],
    );

    return { onChangeRouteSearch, handleFiltersChange, showFilterBySource, initialFiltersRef, formRef, searchRoute };
};
