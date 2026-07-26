import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import {
    AddFuelCardToDriverButton,
    DateInfo,
    FuelCardLatestTransaction,
    FuelCardStatusTag,
    TableColumn,
    TableRowMenu,
    useOpenEditFuelCardPopup,
    UserInfoBlock,
} from '@components';
import { OrderSortingDirection } from '@enums';
import { useFuelCardsActionsPermission, useQueryFilters, useTable } from '@hooks';
import { useAppDispatch } from '@store';
import { fuelActions, FuelCard } from '@store/admin';
import { GetFuelCardParams, useGetFuelCardsQuery } from '@store/api/fuel-cards-api';
import { classname, convertToStringArray, translateByNamespace } from '@utils';

import { FuelCardLimits } from '../fuel-card-limits';

import './cards-table.scss';

const FUEL_CARDS_PARAMS: Partial<GetFuelCardParams> = {
    orderDirection: OrderSortingDirection.ASC,
    orderName: 'id',
};

const cn = classname('fuel-cards-table');
const t = translateByNamespace('admin:fuel:cards-page:table');
const tTable = translateByNamespace('common:staff-table');
const tNot = translateByNamespace('admin:fuel:cards-page:notifications');

export const useCardsTable = () => {
    const { filters } = useQueryFilters<GetFuelCardParams>(FUEL_CARDS_PARAMS);
    const dispatch = useAppDispatch();
    const hasFuelCardsActionsPermission = useFuelCardsActionsPermission();

    const { onPageChangeHandler, onPerPageChangeHandler, onOrderChangeHandler } = useTable();

    const { statuses, ...otherFilters } = filters;

    const {
        data: cardsPaginateData,
        isSuccess,
        isError,
        isLoading,
    } = useGetFuelCardsQuery({ ...FUEL_CARDS_PARAMS, ...otherFilters, statuses: convertToStringArray(statuses) });

    useEffect(() => {
        if (isError) {
            toast.error<string>(tNot('upload-fuel-cards-error-notification'));
        }
    }, [isError]);

    const reassignDriverClickHandler = useCallback(
        async (fuelCard: FuelCard) => dispatch(fuelActions.setFuelCardToDriverPopupProps({ isPopupOpened: true, fuelCard })),
        [dispatch],
    );

    const unassignDriverClickHandler = useCallback(
        async (fuelCard: FuelCard) => dispatch(fuelActions.setUnassignDriverFromFuelCardPopupProps({ isPopupOpened: true, fuelCard })),
        [dispatch],
    );

    const editClickHandler = useOpenEditFuelCardPopup();

    const columns = useMemo<TableColumn<FuelCard>[]>(
        () => [
            {
                key: 'id',
                name: tTable('id-column-name'),
                isSortable: true,
                cellRender: ({ row: { id } }) => id,
            },
            {
                key: 'wex_account',
                name: tTable('company-column-name'),
                cellRender: ({ row: { wexAccount } }) => wexAccount,
            },
            {
                key: 'number',
                name: t('number-column-name'),
                isSortable: true,
                cellRender: ({ row: { number } }) => {
                    const handleCopy = () => {
                        navigator.clipboard.writeText(number);
                        toast.success(tNot<string>('copied-number-success-notification'));
                    };

                    return (
                        <p onClick={handleCopy} title={t('click-to-copy')}>
                            {number}
                        </p>
                    );
                },
            },
            {
                key: 'driver',
                name: t('driver-column-name'),
                cellRender: ({ row }) => {
                    const { account } = row;

                    if (!account) {
                        return <AddFuelCardToDriverButton fuelCard={row} />;
                    }

                    const handleDriverClick = (name: string) => window.open(`/admin/accounting/drivers?name=${encodeURIComponent(name)}`, '_blank');

                    return (
                        <UserInfoBlock
                            name={account.name}
                            avatar={account.avatar}
                            parent={account.parent}
                            showBalance={true}
                            balance={account.defaultBalance}
                            onNameClick={() => handleDriverClick(account.name)}
                            showChatButton={true}
                            accountPublicId={account.publicId}
                        />
                    );
                },
                headerCellClassName: cn('driver'),
            },
            {
                key: 'status',
                name: tTable('status-column-name'),
                isSortable: true,
                cellRender: ({ row: { id, status } }) => <FuelCardStatusTag id={id} status={status} />,
            },
            {
                key: 'limit',
                name: t('limit-column-name'),
                cellRender: ({ row: { limit, limitDef, limitDefGal, limitUlsdGal } }) => (
                    <FuelCardLimits limit={limit} limitUlsdGal={limitUlsdGal} limitDef={limitDef} limitDefGal={limitDefGal} />
                ),
            },
            {
                key: 'available',
                name: t('available-column-name'),
                cellRender: ({ row: { available } }) => {
                    const { def, defGal, ulsd, ulsdGal } = available || {};

                    return <FuelCardLimits limit={ulsd} limitUlsdGal={ulsdGal} limitDef={def} limitDefGal={defGal} />;
                },
            },
            {
                key: 'latest_transaction_time',
                name: t('latest-transaction-column-name'),
                cellRender: ({ row: { rawData } }) => <FuelCardLatestTransaction rawData={rawData} />,
                headerCellClassName: cn('latest-transaction'),
            },
            {
                key: 'created_at',
                name: tTable('created-at-column-name'),
                cellRender: ({ row: { createdAt } }) => <DateInfo date={createdAt} />,
                headerCellClassName: cn('created-at'),
            },
            {
                key: 'actions',
                name: '',
                hide: !hasFuelCardsActionsPermission,
                cellRender: ({ row }) => (
                    <TableRowMenu
                        dataTestId='fuel-cards-actions'
                        options={[
                            {
                                label: t('reassign-driver-action'),
                                onClick: () => reassignDriverClickHandler(row),
                                show: !!row.account?.publicId,
                            },
                            {
                                label: t('unassign-driver-action'),
                                onClick: () => unassignDriverClickHandler(row),
                                show: !!row.account?.publicId,
                            },
                            {
                                label: t('edit-limit-action'),
                                onClick: () => editClickHandler(row),
                            },
                        ]}
                    />
                ),
                headerCellClassName: cn('actions'),
            },
        ],
        [hasFuelCardsActionsPermission, reassignDriverClickHandler, unassignDriverClickHandler, editClickHandler],
    );

    return {
        isLoading,
        columns,
        cardsPaginateData,
        isSuccess,
        filters,
        hasFuelCardsActionsPermission,
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
    };
};
