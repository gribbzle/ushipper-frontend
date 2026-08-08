import React, { useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';

import { TableLoader } from '@/components/common/table/common/table-loader/table-loader';
import { Table } from '@/components/common/table/table';
import { Paper } from '@/components/common/paper/paper';
import { useEffectOnce, usePagination, useTable } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import {
    BlackListItem,
    blackListItemsFiltersSelector,
    blackListPageSelector,
    fetchBlackListItemsAction,
    fetchedBlackListItemsSelector,
    TBlackListItemsFilters,
} from '@store/client';
import { blackListActions } from '@store/common/black-list/slice';
import { authorizedUserCompanyPublicIdSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { RequestStatus } from '@utils/redux';

import { useBlackListTableColumns } from './use-black-list-table-columns';

import './black-list-table.scss';

const t = translateByNamespace('common:black-list-page');
const cn = classname('black-list-table');

export const BlackListTable = () => {
    const dispatch = useAppDispatch();
    const params = useSearchParams();
    const authorizedUserCompanyPublicId = useAppSelector(authorizedUserCompanyPublicIdSelector);
    const filters = useAppSelector(blackListItemsFiltersSelector);

    const getStateFiltersFromUrlParams = useMemo<Partial<TBlackListItemsFilters>>(() => {
        const filters: Partial<TBlackListItemsFilters> = {};

        filters.query = params.get('query');
        filters.page = Number(params.get('page')) || 1;
        filters.perPage = Number(params.get('perPage')) || 20;

        return filters;
    }, [params]);

    useEffectOnce(() => {
        dispatch(blackListActions.clearFilters());
        dispatch(blackListActions.setFilters(getStateFiltersFromUrlParams));

        if (authorizedUserCompanyPublicId) {
            dispatch(blackListActions.setFilters({ companyId: authorizedUserCompanyPublicId }));
        }

        dispatch(fetchBlackListItemsAction());
    }, [dispatch]);

    const { onPageChangeHandler: onPageChange } = usePagination();
    const { onPerPageChangeHandler: onPerPageChange } = useTable();

    const { columns, onEditClickHandler } = useBlackListTableColumns();
    const fetchedBlackListItems = useSelector(fetchedBlackListItemsSelector);

    const onPageChangeHandler = useCallback(
        (page: number) => {
            dispatch(blackListActions.setFilters({ page }));
            dispatch(fetchBlackListItemsAction());
            onPageChange(page);
        },
        [dispatch, onPageChange],
    );

    const onPerPageChangeHandler = useCallback(
        (perPage: number) => {
            dispatch(blackListActions.setFilters({ perPage, page: 1 }));
            dispatch(fetchBlackListItemsAction());

            onPerPageChange(perPage);
        },
        [dispatch, onPerPageChange],
    );

    const {
        fetchBlackListItems: { status },
    } = useSelector(blackListPageSelector);

    if (status === RequestStatus.PROCESSING) {
        return <TableLoader />;
    }

    if (fetchedBlackListItems.length === 0) {
        return <Paper body={<div className={cn('no-data')}>{t('table:empty-message')}</div>} />;
    }

    return (
        <div className={cn()}>
            {fetchedBlackListItems?.length && (
                <Table<BlackListItem>
                    columns={columns}
                    data={fetchedBlackListItems}
                    isRowClickable={() => true}
                    onRowClick={({ publicId }) => onEditClickHandler(publicId)}
                    isSticky={true}
                    paginationProps={{
                        page: filters.page ?? 1,
                        perPage: filters.perPage ?? 20,
                        lastPage: filters.lastPage,
                        from: filters.from,
                        total: filters.total,
                        to: filters.to,
                        onPageChange: onPageChangeHandler,
                        onChangePerPage: onPerPageChangeHandler,
                    }}
                />
            )}
        </div>
    );
};
