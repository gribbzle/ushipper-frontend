import React from 'react';

import { CatalogListTabsEnum } from '@/enums/catalog-list-tabs-enum';
import { XIcon } from '@icons';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { Tag } from '../tag';

import { FiltersCurrentSearchProps } from './filters-current-search.types';
import { useFiltersCurrentSearch } from './use-filters-current-search';

import './filters-current-search.scss';

const t = translateByNamespace('client:loadboard-filters');

const cn = classname('filters-current-search');

export function FiltersCurrentSearch<T extends Record<string, any>>({
    filters,
    onResetFilter,
    onResetAllFilters,
    filterPropsList,
    getFilterLabel,
    getFilterValue,
}: FiltersCurrentSearchProps<T>) {
    const { resetFilterValue, filtersHaveValue, filterNames } = useFiltersCurrentSearch({
        filters,
        onResetFilter,
        filterPropsList,
        getFilterLabel,
        getFilterValue,
    });

    if (!filtersHaveValue || filters.statisticsStatus !== CatalogListTabsEnum.ALL) {
        return null;
    }

    return (
        <div className={cn()}>
            <div className={cn('title')}>{t('current-search')}:</div>
            {filterPropsList.map((prop, index) => {
                const value = getFilterValue(prop, filters);

                return value ? (
                    <Tag className={cn('item')} key={index} withHover={true} elementTag='button' onClick={() => resetFilterValue(prop)}>
                        {filterNames[prop]}: {value}
                        <div className={cn('reset-icon')}>
                            <XIcon />
                        </div>
                    </Tag>
                ) : null;
            })}
            <Tag onClick={onResetAllFilters} className={cn('item')} type='primary' elementTag='button' withHover={true}>
                {t('clear-all')}
            </Tag>
        </div>
    );
}
