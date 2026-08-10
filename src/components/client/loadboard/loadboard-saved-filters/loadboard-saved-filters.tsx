import React, { useEffect, useMemo, useState } from 'react';

import { SavedLoadboardSearch } from '@/api/loadboard';
import TrashCanIcon from '@/assets/icons/trash-can.svg';
import { Button } from '@/components/common/button/button';
import { Tag } from '@/components/common/tag/tag';
import { Popup } from '@/components/common/popup/popup';
import { areFiltersEqual } from '@/utils/filters';
import { useAppDispatch, useAppSelector } from '@store';
import { removeLoadboardSearch } from '@store/client/loadboard/actions';
import { loadboardListSelector, loadboardSavedSearchesSelector } from '@store/client/loadboard/selectors';
import { loadboardActions } from '@store/client/loadboard/slice';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './loadboard-saved-filters.scss';
import ArrowDownIcon from '@/assets/icons/arrow-down.svg';

const t = translateByNamespace('client:loadboard-filters');
const cn = classname('loadboard-saved-filters');

const PER_PAGE = 7;

export const LoadboardSavedFilters = () => {
    const dispatch = useAppDispatch();
    const { filters } = useAppSelector(loadboardListSelector);
    const { searches: savedSearches } = useAppSelector(loadboardSavedSearchesSelector);
    const [removingSearches, setRemovingSearches] = useState<Record<string, boolean>>({});
    const [page, setPage] = useState(1);
    const [searchToRemove, setSearchToRemove] = useState<SavedLoadboardSearch | null>(null);
    const [selectedSearchIndex, setSelectedSearchIndex] = useState<number>(-1);

    const visibleSearches = useMemo<SavedLoadboardSearch[]>(() => {
        return savedSearches.slice(0, page * PER_PAGE);
    }, [savedSearches, page]);

    useEffect(() => {
        const selectedSearch = savedSearches[selectedSearchIndex];

        if (selectedSearch && !areFiltersEqual(selectedSearch.filters, filters)) {
            setSelectedSearchIndex(-1);
        }
    }, [filters]);

    const appleFilters = (search: SavedLoadboardSearch, index: number) => {
        setSelectedSearchIndex(index);
        dispatch(loadboardActions.replaceListFilters(search.filters));
    };

    const onRemove = () => {
        if (!searchToRemove) {
            return;
        }

        const id = searchToRemove.publicId;

        if (removingSearches[id]) {
            return;
        }

        setRemovingSearches(state => ({ ...state, [id]: true }));
        dispatch(
            removeLoadboardSearch({
                id: id,
            }),
        )
            .unwrap()
            .then(() => {
                setRemovingSearches(state => ({ ...state, [id]: false }));
                setSearchToRemove(null);
            });
    };

    const loadMore = () => {
        setPage(state => {
            return state * PER_PAGE < savedSearches.length ? state + 1 : state;
        });
    };

    const loadLess = () => {
        setPage(state => {
            return state > 1 ? state - 1 : state;
        });
    };

    return (
        <div className={cn()}>
            <div className={cn('list')}>
                {visibleSearches.map((search, index) => (
                    <Tag
                        elementTag='button'
                        withHover={true}
                        className={cn('item')}
                        key={search.publicId}
                        type={index === selectedSearchIndex ? 'plain-primary' : 'default'}
                        onClick={() => appleFilters(search, index)}
                    >
                        {search.name}
                        <div className={cn('remove-btn')} onClick={() => !removingSearches[search.publicId] && setSearchToRemove(search)}>
                            <TrashCanIcon />
                        </div>
                    </Tag>
                ))}
            </div>
            <div className={cn('row')}>
                {visibleSearches.length < savedSearches.length && (
                    <button className={cn('show-more')} onClick={loadMore}>
                        {t('show-more')}
                        <ArrowDownIcon />
                    </button>
                )}
                {page > 1 && (
                    <button className={cn('show-less')} onClick={loadLess}>
                        {t('show-less')}
                        <ArrowDownIcon />
                    </button>
                )}
            </div>

            <Popup
                isOpen={!!searchToRemove}
                onClose={() => setSearchToRemove(null)}
                title={t('remove-search-popup', { search: searchToRemove?.name || '' })}
                actions={
                    <>
                        <Button size='small' view='danger' onClick={onRemove}>
                            {t('remove')}
                        </Button>
                        <Button size='small' onClick={() => setSearchToRemove(null)}>
                            {t('cancel')}
                        </Button>
                    </>
                }
            />
        </div>
    );
};
