import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { Paginate } from '@/components/common/paginate/paginate';
import { CatalogListTabsEnum } from '@/enums/catalog-list-tabs-enum';
import { CatalogStatistic } from '@store/client';
import { catalogsSliceActions } from '@store/client/catalogs/slice';
import { classname } from '@utils/classname';

import { LoadboardNoData } from '../../loadboard';
import { CatalogFiltersForm } from '../catalog-filters-form';
import { CatalogFilterTabs, useCatalogFiltersTabs } from '../catalog-filters-tabs';

import { CatalogPageLayoutProps } from './catalog-page-layout.types';
import { useCatalogPageLayoutScroll } from './use-catalog-page-layout-scroll';

import './catalog-page.scss';

const cn = classname('catalog-page');

export const CatalogPageLayout = <T, S extends CatalogStatistic>({
    renderCatalogListComponent,
    items,
    catalogStats,
    lastPage,
    emptyTitle,
    isResponseSuccess,
}: CatalogPageLayoutProps<T, S>) => {
    const { selectedTab, currentPage, handlePageChange } = useCatalogFiltersTabs();

    useCatalogPageLayoutScroll(currentPage);

    const dispatch = useDispatch();

    const handleResetFilters = useCallback(() => {
        dispatch(catalogsSliceActions.setIsAllFiltersReset(true));
        dispatch(catalogsSliceActions.setSelectedFilters({}));
    }, [dispatch]);

    return (
        <>
            <CatalogFilterTabs catalogStats={catalogStats} />
            <div className={cn('content')}>
                {selectedTab === CatalogListTabsEnum.ALL && <CatalogFiltersForm />}
                <div className={cn('wrapper')}>
                    {!!items?.length && renderCatalogListComponent(items)}
                    {!items?.length && isResponseSuccess && (
                        <div className={cn('empty-list')}>
                            <LoadboardNoData
                                isRefetchButtonShown={selectedTab === CatalogListTabsEnum.ALL}
                                onFiltersRefresh={handleResetFilters}
                                emptyText={emptyTitle}
                            />
                        </div>
                    )}
                    {lastPage && lastPage > 1 && <Paginate page={currentPage} lastPage={lastPage} onChange={handlePageChange} />}
                </div>
            </div>
        </>
    );
};
