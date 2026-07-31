import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { CatalogFiltersFormState } from '@/components/client/catalogs/catalog-filters-form/catalog-filters-form.types';
import { TabItemBase } from '@/components/common/tabs/tabs';
import { CatalogListTabsEnum, CatalogSortingNameEnum, OrderSortingDirection } from '@/enums';
import { useAppDispatch, useAppSelector } from '@store';
import { catalogsSelectedFiltersSelector } from '@store/client/catalogs/selectors';
import { catalogsSliceActions } from '@store/client/catalogs/slice';

import { CatalogFiltersValue } from './catalog-filters-tabs.types';
import { getCatalogFiltersForUrlParams } from './utils';

export const useCatalogFiltersTabs = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const filters = useAppSelector(catalogsSelectedFiltersSelector);

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTab, setSelectedTab] = useState<CatalogListTabsEnum>((router.query.statisticsStatus as CatalogListTabsEnum) ?? CatalogListTabsEnum.ALL);
    const selectedTabIndexRef = useRef(Object.values(CatalogListTabsEnum).indexOf(selectedTab));

    useEffect(() => {
        setSelectedTab(filters.statisticsStatus ?? CatalogListTabsEnum.ALL);
    }, [filters.statisticsStatus]);

    const onSelectTab = useCallback(
        async (tab: TabItemBase) => {
            const newFilters = {
                ...filters,
                statisticsStatus: tab.value as CatalogListTabsEnum,
                page: 1,
            };

            await dispatch(catalogsSliceActions.setSelectedFilters(newFilters as CatalogFiltersValue));
            setSelectedTab(tab.value as CatalogListTabsEnum);
        },
        [filters, dispatch],
    );

    const handlePageChange = useCallback(
        async (newPage: number) => {
            const newFilters = {
                ...filters,
                page: newPage,
            };

            await dispatch(catalogsSliceActions.setSelectedFilters(newFilters as CatalogFiltersValue));
            setCurrentPage(newPage);
        },
        [dispatch, filters],
    );

    const onFiltersFormChange = useCallback(
        (values: CatalogFiltersFormState) => {
            const { sortBy, ...others } = values;

            const newFilters = {
                ...others,
                orderName: sortBy ? (sortBy[0]?.value as CatalogSortingNameEnum) : CatalogSortingNameEnum.CREATED_AT,
                orderDirection: sortBy ? sortBy[1]?.value : OrderSortingDirection.ASC,
                statisticsStatus: CatalogListTabsEnum.ALL,
                page: 1,
            };

            dispatch(catalogsSliceActions.setSelectedFilters(newFilters as CatalogFiltersValue));
        },
        [dispatch],
    );

    useEffect(() => {
        const query = getCatalogFiltersForUrlParams(filters);

        router.replace(
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
    }, [filters]);

    useEffect(() => {
        if (filters.page) {
            setCurrentPage(filters.page);
        }
    }, [filters.page]);

    useEffect(() => {
        if (!filters.statisticsStatus) {
            const newFilters = {
                ...filters,
                page: 1,
                statisticsStatus: router.query.statisticsStatus ?? CatalogListTabsEnum.ALL,
            };

            dispatch(catalogsSliceActions.setSelectedFilters(newFilters as CatalogFiltersValue));
        }
    }, [filters, dispatch, router]);

    return { selectedTabIndexRef, selectedTab, onSelectTab, currentPage, handlePageChange, onFiltersFormChange };
};
