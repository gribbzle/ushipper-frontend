import React, { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';

import { LoadboardFilters } from '@/components/client/loadboard/loadboard-filters/loadboard-filters';
import { LoadboardList } from '@/components/client/loadboard/loadboard-list/loadboard-list';
import { LoadboardMap } from '@/components/client/loadboard/loadboard-map/loadboard-map';
import { LoadboardNoData } from '@/components/client/loadboard/loadboard-no-data/loadboard-no-data';
import { Paginate } from '@/components/common/paginate/paginate';
import { LoadboardTab } from '@/enums/tabs/loadboard-tab';
import { useLoadboard } from '@/hooks/loadboard/use-loadboard';
import { useLoadboardTabSelection } from '@/hooks/loadboard/useLoadboardTabSelection';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { translateLoadboardTab } from '@utils/translate/loadboard';

import './loadboard-content.scss';
import 'react-loading-skeleton/dist/skeleton.css';

const cn = classname('loadboard-content');
const tNoData = translateByNamespace('client:loadboard:no-data');

export const LoadboardContent = () => {
    const {
        loadBoardFilters,
        LoaderItems,
        isMapOpened,
        showNoData,
        showFilters,
        data,
        selectedTab,
        filters,
        isFetching,
        params,
        page,
        onFiltersChange,
        handleChangePage,
        onFiltersReset,
    } = useLoadboard();

    const { activeTab, isSavedTab, isAllTab } = useLoadboardTabSelection();

    const showLoadboardMap = useMemo(() => isMapOpened && (isAllTab || isSavedTab), [isAllTab, isMapOpened, isSavedTab]);
    const showLoadboardFilters = useMemo(() => showFilters && (!activeTab || isAllTab || isSavedTab), [activeTab, isAllTab, isSavedTab, showFilters]);

    return (
        <div className={cn('')}>
            {showLoadboardFilters && <LoadboardFilters filtersChanged={onFiltersChange} filters={filters} />}
            {data?.data &&
                (showLoadboardMap ? (
                    <LoadboardMap loadBoardFilters={loadBoardFilters} searchParams={params} selectedTab={selectedTab} orders={data.data} />
                ) : (
                    <div className={cn('col')}>
                        {isFetching ? (
                            <div>
                                {LoaderItems.map(item => {
                                    return (
                                        <Skeleton
                                            key={item}
                                            baseColor='#f3f3f3'
                                            highlightColor='#ecebeb'
                                            containerClassName={cn('item-preloader-wrapper')}
                                            className={cn('item-preloader')}
                                            count={1}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            <>
                                {showNoData && (
                                    <LoadboardNoData
                                        isRefetchButtonShown={[LoadboardTab.ALL, LoadboardTab.SAVED].includes(selectedTab)}
                                        onFiltersRefresh={onFiltersReset}
                                        emptyText={
                                            [LoadboardTab.ALL, LoadboardTab.SAVED].includes(selectedTab)
                                                ? tNoData('no-data')
                                                : tNoData('no-data-tab', { tab: translateLoadboardTab(selectedTab) })
                                        }
                                    />
                                )}
                                {!showNoData && (
                                    <>
                                        <LoadboardList loadBoardFilters={loadBoardFilters} orders={data.data} />
                                        <div className={cn('pagination')}>
                                            {data.meta.lastPage > 1 && <Paginate page={page} lastPage={data.meta.lastPage} onChange={handleChangePage} />}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                ))}
        </div>
    );
};
