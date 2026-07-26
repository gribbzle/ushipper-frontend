import React from 'react';

import { CatalogFiltersCurrentSearch, Paper, Tabs } from '@components';
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
