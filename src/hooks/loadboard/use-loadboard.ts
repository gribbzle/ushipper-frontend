import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import { LoadboardFiltersFromUrlParams } from '@/components/client/loadboard/loadboard-filters/types';
import { getLoadboardFiltersForUrlParams, getLoadboardFiltersFromUrlParams } from '@/components/client/loadboard/loadboard-filters/utils';
import { TabItemBase } from '@/components/common/tabs/tabs';
import { areFiltersEqual } from '@/utils/filters';
import { LoadboardTab } from '@enums';
import { useAppSelector } from '@store';
import { LoadBoardFilters, SavedLoadBoardFilters, useGetLoadboardItemsQuery, useGetLoadboardStatisticQuery } from '@store/api/loadboard-api';
import { isSearchAlongRouteSelector, loadboardListSelector } from '@store/client/loadboard/selectors';
import { INITIAL_FILTERS, loadboardActions } from '@store/client/loadboard/slice';

import { convertFiltersToRequestFilters, isSearchRouteFilters } from './utils';

const PER_PAGE = 50;

export const useLoadboard = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [filtersReady, setFiltersReady] = useState<boolean>(false);
    const skipPageUpdate = useRef(false);
    const [selectedTab, setSelectedTab] = useState<LoadboardTab>(LoadboardTab.ALL);
    const { filters } = useAppSelector(loadboardListSelector);
    const searchRoute = useAppSelector(isSearchAlongRouteSelector);

    const { saveSearchDrawer } = useAppSelector(state => state.client.loadboard);
    const dispatch = useDispatch();
    const [requestFilters, setRequestFilters] = useState<LoadBoardFilters>({} as LoadBoardFilters);

    const params = useSearchParams();
    const [tabFilters, setTabFilters] = useState({});
    const [filtersApplied, setFiltersApplied] = useState(false);

    const { data, isLoading, isFetching, isError, error } = useGetLoadboardItemsQuery(
        {
            filters: {
                ...requestFilters,
                ...tabFilters,
                perPage: PER_PAGE,
            },
        },
        { skip: !filtersReady },
    );
    const { data: statistic } = useGetLoadboardStatisticQuery(
        {
            filters: requestFilters,
        },
        { skip: !filtersReady },
    );

    const updateTabFilters = useCallback((tab: LoadboardTab) => {
        if (tab === LoadboardTab.ALL || tab === LoadboardTab.SAVED) {
            setTabFilters({});
        } else {
            setTabFilters({
                hasOrderRequests: tab === LoadboardTab.REQUESTED ? 1 : 0,
                hasAcceptedOffers: tab === LoadboardTab.BOOKED ? 1 : 0,
                hasDeclinedUserOrderStatus: tab === LoadboardTab.DECLINED ? 1 : 0,
                hasCalledUserOrderStatus: tab === LoadboardTab.CALLED ? 1 : 0,
                hasFlags: tab === LoadboardTab.FLAGGED ? 1 : 0,
            });
        }

        setSelectedTab(tab);
    }, []);

    const previousQuery = useRef<LoadboardFiltersFromUrlParams | null>(null);

    const filterQueryParams = useCallback((query: LoadboardFiltersFromUrlParams) => {
        const { drawerParsedOrderId: _drawerParsedOrderId, ...filteredQuery } = query;

        return filteredQuery;
    }, []);

    useEffect(() => {
        const query: LoadboardFiltersFromUrlParams = filterQueryParams(router.query) as LoadboardFiltersFromUrlParams;

        if (previousQuery.current) {
            const previousFilteredQuery = filterQueryParams(previousQuery.current);

            if (areFiltersEqual(previousFilteredQuery, query)) {
                previousQuery.current = query;

                return;
            }
        }

        setFiltersReady(false);

        const urlFilters = getLoadboardFiltersFromUrlParams(query);
        const { page, tab, ...restFilters } = urlFilters;

        if (page) {
            setPage(page);
        }

        if (tab) {
            updateTabFilters(tab);
        }

        if (!filtersApplied && isSearchRouteFilters(restFilters) && !areFiltersEqual(INITIAL_FILTERS, restFilters)) {
            dispatch(loadboardActions.setIsSearchAlongRoute(true));
        }

        dispatch(loadboardActions.replaceListFilters({ ...INITIAL_FILTERS, ...restFilters }));
        setRequestFilters({ ...convertFiltersToRequestFilters({ ...INITIAL_FILTERS, ...urlFilters }, searchRoute), page });
        setFiltersReady(true);
        previousQuery.current = query;
    }, [dispatch, setFiltersReady, updateTabFilters, searchRoute, filtersApplied, router.query, filterQueryParams]);

    useEffect(() => {
        if (skipPageUpdate.current) {
            skipPageUpdate.current = false;

            return;
        }

        setRequestFilters({ ...convertFiltersToRequestFilters(filters, searchRoute), page });
        setFiltersApplied(true);
    }, [filters, page, searchRoute]);

    const updateURLFilters = useCallback(
        async (filters: SavedLoadBoardFilters & { page?: number; tab?: LoadboardTab }, search?: boolean) => {
            const query = getLoadboardFiltersForUrlParams(filters, search === undefined ? searchRoute : search);

            await router.replace(
                {
                    pathname: router.pathname,
                    query,
                },
                {
                    pathname: router.asPath.split('?')[0],
                    query,
                },
                { shallow: true },
            );
        },
        [router, searchRoute],
    );

    const handleScrollPage = useCallback(() => {
        const mainLayoutNode = document.querySelector('.main-layout__body') as Element;

        if (mainLayoutNode) {
            mainLayoutNode.scrollTop = 0;
        }
    }, []);

    const onFiltersChange = useCallback(
        (filters: SavedLoadBoardFilters) => {
            skipPageUpdate.current = page !== 1;

            setPage(1);
            dispatch(loadboardActions.replaceListFilters(filters));
            updateURLFilters({ ...filters, tab: selectedTab, page: 1 });
        },
        [dispatch, updateURLFilters, selectedTab, page],
    );

    const onSelectTab = useCallback(
        (tab: TabItemBase) => {
            updateTabFilters(tab.value as LoadboardTab);

            setPage(1);
            updateURLFilters({ ...filters, page: 1, tab: tab.value as LoadboardTab });
        },
        [updateTabFilters, updateURLFilters, filters],
    );

    const onFiltersReset = useCallback(() => onFiltersChange(INITIAL_FILTERS), [onFiltersChange]);

    const onCloseDrawer = useCallback(
        () => dispatch(loadboardActions.setSaveSearchDrawer({ ...saveSearchDrawer, opened: false })),
        [dispatch, saveSearchDrawer],
    );

    const showFilters = useMemo(
        () =>
            (params.has('filters') && params.get('filters') === '1') ||
            (!params.has('filters') && (selectedTab === LoadboardTab.ALL || selectedTab === LoadboardTab.SAVED)),
        [params, selectedTab],
    );

    const showNoData = useMemo(() => filtersApplied && !isLoading && !data?.data.length, [filtersApplied, isLoading, data?.data.length]);

    const isMapOpened = useMemo(() => params.get('map') === '1', [params]);

    useEffect(() => handleScrollPage(), [handleScrollPage]);

    const handleChangePage = useCallback(
        (page: number) => {
            setPage(page);
            dispatch(loadboardActions.setListFilters({ ...filters }));
            handleScrollPage();
            updateURLFilters({ ...filters, page });
        },
        [dispatch, filters, updateURLFilters, handleScrollPage],
    );

    const LoaderItems = Array.from({ length: PER_PAGE }, (_, index) => index);

    const loadBoardFilters = useMemo(() => {
        return { ...requestFilters, ...tabFilters, perPage: PER_PAGE };
    }, [requestFilters, tabFilters]);

    return {
        loadBoardFilters,
        LoaderItems,
        isMapOpened,
        showNoData,
        showFilters,
        statistic,
        data,
        isLoading,
        selectedTab,
        filters,
        isFetching,
        params,
        saveSearchDrawer,
        page,
        isError,
        error,
        onFiltersChange,
        handleChangePage,
        onCloseDrawer,
        onFiltersReset,
        onSelectTab,
        updateURLFilters,
    };
};
