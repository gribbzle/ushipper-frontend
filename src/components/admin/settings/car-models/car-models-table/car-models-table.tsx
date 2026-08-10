import React, { memo, useCallback, useMemo } from 'react';
import { toSnakeCase } from 'js-convert-case';
import { useRouter } from 'next/router';

import { StatusBlock } from '@/components/common/status-block/status-block';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { Table } from '@/components/common/table/table';
import { TableColumn } from '@/components/common/table/table.types';
import { TableRowMenu } from '@/components/common/table/common/table-row-menu/table-row-menu';
import { useAppDispatch, useAppSelector } from '@store';
import { CarModel, carModelsFiltersSelector, carModelsSelector } from '@store/admin';
import { carModelsSettingsActions } from '@store/admin/car-models-settings/slice';
import { formatDateOrGetDash } from '@utils/dates';

type CarModelsTableProps = {
    onPageChange: () => void;
    onSortChange: () => void;
    onRowClick: (id: number) => void;
};

const CAR_MODEL_STATUSES_LABELS: any = {
    active: 'Active',
    deleted: 'Deleted',
};

export const CarModelsTable = memo(({ onPageChange, onSortChange, onRowClick }: CarModelsTableProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const filters = useAppSelector(carModelsFiltersSelector);

    const carModels = useAppSelector(carModelsSelector);

    const columns = useMemo<TableColumn<CarModel>[]>(
        () => [
            { key: 'maker', name: 'Maker', isSortable: true },
            { key: 'name', name: 'Name' },
            { key: 'weight', name: 'Weight', cellRender: ({ value }) => (value ? `${value} kg` : '—') },
            {
                key: 'status',
                name: 'Status',
                cellRender: ({ value }) => <StatusBlock view={value === 'active' ? 'success' : 'danger'}>{CAR_MODEL_STATUSES_LABELS[value]}</StatusBlock>,
            },
            { key: 'createdBy', name: 'Created By', cellRender: ({ value }) => <UserInfoBlock {...value} /> },
            { key: 'createdAt', name: 'Created at', cellRender: ({ value }) => formatDateOrGetDash(value) },
            { key: 'updatedAt', name: 'Updated at', cellRender: ({ value }) => formatDateOrGetDash(value) },
            {
                key: 'actions',
                name: '',
                cellRender: ({ row: { id, name, status } }) => {
                    if (status === 'deleted') {
                        return null;
                    }

                    return (
                        <TableRowMenu
                            dataTestId='car-models-table-actions'
                            options={[
                                {
                                    label: 'Edit',
                                    onClick: () => {
                                        onRowClick(id);
                                        dispatch(
                                            carModelsSettingsActions.setCreateEditCarModelDrawerProps({
                                                isVisible: true,
                                                mode: 'edit',
                                                carModelId: id,
                                                carModelName: name,
                                            }),
                                        );
                                    },
                                },
                                {
                                    label: 'Delete',
                                    onClick: () => {
                                        dispatch(
                                            carModelsSettingsActions.setDeleteCarModelPopupProps({
                                                isVisible: true,
                                                carModelId: id,
                                                carModelName: name,
                                            }),
                                        );
                                    },
                                },
                            ]}
                        />
                    );
                },
            },
        ],
        [dispatch, onRowClick],
    );

    const onPageChangeHandler = useCallback(
        (page: number) => {
            dispatch(carModelsSettingsActions.setFilters({ page }));
            onPageChange();
        },
        [dispatch, onPageChange],
    );

    const onPerPageChangeHandler = useCallback(
        (perPage: number) => {
            dispatch(carModelsSettingsActions.setFilters({ perPage, page: 1 }));
            router.replace({ pathname: router.pathname, query: { ...router.query, perPage } });

            onPageChange();
        },
        [dispatch, onPageChange, router],
    );

    const onOrderChangeHandler = useCallback(
        (orderName: string, orderDirection: string) => {
            router.replace({ pathname: router.pathname, query: { ...router.query, orderName: toSnakeCase(orderName), orderDirection } });
            dispatch(carModelsSettingsActions.setFilters({ orderName, orderDirection }));
            onSortChange();
        },
        [dispatch, onSortChange, router],
    );

    const handleRowClick = useCallback(
        (row: CarModel) => {
            onRowClick(row.id);
            dispatch(
                carModelsSettingsActions.setCreateEditCarModelDrawerProps({
                    isVisible: true,
                    mode: 'edit',
                    carModelId: row.id,
                    carModelName: row.name,
                }),
            );
        },
        [dispatch, onRowClick],
    );

    return (
        <Table<CarModel>
            columns={columns}
            data={carModels}
            orderName={filters.orderName}
            orderDirection={filters.orderDirection}
            onOrderChange={onOrderChangeHandler}
            isRowClickable={row => row.status !== 'deleted'}
            onRowClick={handleRowClick}
            isSticky={true}
            paginationProps={{
                page: filters.page,
                perPage: filters.perPage,
                lastPage: filters?.lastPage,
                from: filters.from,
                to: filters.to,
                total: filters.total,
                onPageChange: onPageChangeHandler,
                onChangePerPage: onPerPageChangeHandler,
            }}
        />
    );
});

CarModelsTable.displayName = 'CarModelsTable';
