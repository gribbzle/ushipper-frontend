import React, { useCallback, useMemo } from 'react';
import { toSnakeCase } from 'js-convert-case';
import { useRouter } from 'next/router';

import { Link, StatusBlock, Table, TableColumn, TableRowMenu, UserInfoBlock } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@store';
import { CarMaker } from '@store/admin';
import { carMakersFiltersSelector, carMakersSelector } from '@store/admin/car-makers-settings/selectors';
import { carMakersSettingsActions } from '@store/admin/car-makers-settings/slice';
import { classname } from '@utils/classname';
import { formatDateOrGetDash } from '@utils/dates';

import './car-makers-table.scss';

type CarMakersTableProps = {
    onPageChange: () => void;
    onOrderChange: () => void;
    onRowClick: (carMakerId: number) => void;
};

type CarMakerStatus = 'active' | 'deleted';

const CAR_MAKER_STATUSES_LABELS: Record<CarMakerStatus, string> = {
    active: 'Active',
    deleted: 'Deleted',
};

const cn = classname('car-makers-table');

export const CarMakersTable = ({ onPageChange, onOrderChange, onRowClick }: CarMakersTableProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const carMakers = useAppSelector(carMakersSelector);

    const columns = useMemo<TableColumn<CarMaker>[]>(
        () => [
            { key: 'name', name: 'Name', isSortable: true },
            {
                key: 'modelsCount',
                name: 'Models',
                cellRender: ({ value, row: { id, name } }) => (
                    <Link
                        onClick={e => {
                            e.stopPropagation();
                        }}
                        className={cn('models-link')}
                        href={{ pathname: '/admin/settings/car-models', query: { makerId: id, makerName: name } }}
                    >
                        {value} Models
                    </Link>
                ),
            },
            {
                key: 'status',
                name: 'Status',
                cellRender: ({ value }) => (
                    <StatusBlock view={value === 'active' ? 'success' : 'danger'}>{CAR_MAKER_STATUSES_LABELS[value as CarMakerStatus]}</StatusBlock>
                ),
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
                            dataTestId='car-makers-table-actions'
                            options={[
                                {
                                    label: 'Edit',
                                    onClick: () => {
                                        onRowClick(id);
                                        dispatch(
                                            carMakersSettingsActions.setCreateEditCarMakerDrawerProps({
                                                isVisible: true,
                                                mode: 'edit',
                                                carMakerId: id,
                                                carMakerName: name,
                                            }),
                                        );
                                    },
                                },
                                {
                                    label: 'Delete',
                                    onClick: () => {
                                        dispatch(
                                            carMakersSettingsActions.setDeleteCarMakerPopupProps({
                                                isVisible: true,
                                                carMakerId: id,
                                                carMakerName: name,
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

    const filters = useAppSelector(carMakersFiltersSelector);

    const onPageChangeHandler = useCallback(
        (page: number) => {
            dispatch(carMakersSettingsActions.setFilters({ page }));
            onPageChange();
        },
        [dispatch, onPageChange],
    );

    const onPerPageChangeHandler = useCallback(
        (perPage: number) => {
            dispatch(carMakersSettingsActions.setFilters({ perPage, page: 1 }));
            router.replace({ pathname: router.pathname, query: { ...router.query, perPage } });

            onPageChange();
        },
        [dispatch, onPageChange, router],
    );

    const onOrderChangeHandler = useCallback(
        (orderName: string, orderDirection: string) => {
            dispatch(carMakersSettingsActions.setFilters({ orderName, orderDirection }));
            onOrderChange();
            router.replace({ pathname: router.pathname, query: { ...router.query, orderName: toSnakeCase(orderName), orderDirection } });
        },
        [dispatch, onOrderChange, router],
    );

    const onRowClickHandler = useCallback(
        (carMaker: CarMaker) => {
            onRowClick(carMaker.id);
            dispatch(
                carMakersSettingsActions.setCreateEditCarMakerDrawerProps({
                    isVisible: true,
                    mode: 'edit',
                    carMakerId: carMaker.id,
                    carMakerName: carMaker.name,
                }),
            );
        },
        [dispatch, onRowClick],
    );

    return (
        <Table<CarMaker>
            columns={columns}
            data={carMakers}
            orderName={filters.orderName}
            orderDirection={filters.orderDirection}
            onOrderChange={onOrderChangeHandler}
            isRowClickable={({ status }) => status !== 'deleted'}
            onRowClick={onRowClickHandler}
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
};
