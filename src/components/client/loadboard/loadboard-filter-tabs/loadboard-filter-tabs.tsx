import React, { useEffect } from 'react';

import { LoadboardFiltersCurrentSearch, LoadboardSavedFilters, Paper, Tabs } from '@components';
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
