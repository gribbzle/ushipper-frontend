import React, { useEffect } from 'react';

import { LoadboardFiltersCurrentSearch } from '@/components/client/loadboard/loadboard-filters-current-search/loadboard-filters-current-search';
import { LoadboardSavedFilters } from '@/components/client/loadboard/loadboard-saved-filters/loadboard-saved-filters';
import { Tabs } from '@/components/common/tabs/tabs';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { useLoadboardTabSelection } from '@hooks';
import { useAppDispatch } from '@store';
import { getLoadboardSearches } from '@store/client/loadboard/actions';

import { LoadboardFilterTabsProps } from './loadboard-filter-tabs.types';
import { useLoadboardTabs } from './useLoadboardTabs';

export const LoadboardFilterTabs = ({ onSelectTab }: LoadboardFilterTabsProps) => {
    const dispatch = useAppDispatch();
    const { tabs, initialTabIndex } = useLoadboardTabs();
    const { isSavedTab, isAllTab } = useLoadboardTabSelection();

    useEffect(() => {
        dispatch(getLoadboardSearches());
    }, [dispatch]);

    return (
        <Paper
            body={
                <div>
                    <Tabs tabs={tabs} onSelectTab={onSelectTab} initialSelectedTabIndex={initialTabIndex} />
                    {isSavedTab && <LoadboardSavedFilters />}
                    {isAllTab && <LoadboardFiltersCurrentSearch />}
                </div>
            }
        />
    );
};
