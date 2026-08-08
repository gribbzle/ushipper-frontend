import React from 'react';

import { CatalogFiltersCurrentSearch } from '@/components/client/catalogs/catalog-filters-current-search/catalog-filters-current-search';
import { Tabs } from '@/components/common/tabs/tabs';
import { Paper } from '@/components/common/paper/paper';
import { CatalogStatistic } from '@store/client';

import { useCatalogFiltersTabs } from './use-catalog-filters-tabs';
import { useCatalogTabValues } from './use-catalog-tab-values';

export const CatalogFilterTabs = <S extends CatalogStatistic>({ catalogStats }: { catalogStats: S }) => {
    const { selectedTabIndexRef, onSelectTab } = useCatalogFiltersTabs();
    const { tabs } = useCatalogTabValues(catalogStats);

    return (
        <Paper
            body={
                <div>
                    <Tabs tabs={tabs} onSelectTab={onSelectTab} initialSelectedTabIndex={selectedTabIndexRef.current} />
                    <CatalogFiltersCurrentSearch />
                </div>
            }
        />
    );
};
