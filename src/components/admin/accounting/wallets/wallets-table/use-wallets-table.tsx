import React, { useEffect } from 'react';
import { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { toast } from 'react-toastify';

import { DateInfo, Link, TableColumn, TableRowMenu } from '@/components/common';
import { BalanceType, OrderSortingDirection } from '@/enums';
import { useQueryFilters, useTable } from '@hooks';
import { useAppDispatch } from '@store';
import { accountingActions, FinancialBalanceData, FinancialBalanceFilters } from '@store/admin';
import { useGetBalancesWithPaginateQuery } from '@store/api/balances-api';
import { classname, translateByNamespace } from '@utils';

import { WalletAmountBlock } from './wallet-amount-block';

export const SYSTEM_WALLET_TYPES = [
    BalanceType.BROKER_WALLET,
    BalanceType.COD_WALLET,
    BalanceType.DISPATCH_WALLET,
    BalanceType.FACTORING_WALLET,
    BalanceType.USHIPPER_WALLET,
    BalanceType.CUSTOM_INTERNAL_WALLET,
];

const INITIAL_FILTERS = {
    orderName: 'name',
    orderDirection: OrderSortingDirection.ASC,
};

const t = translateByNamespace('admin:accounting:wallets-page:table');
const cn = classname('wallets-table');

export const useWalletsTable = () => {
    const dispatch = useAppDispatch();
    const { filters } = useQueryFilters<FinancialBalanceFilters & { type?: 'custom' | 'system' }>(INITIAL_FILTERS);
    const { onOrderChangeHandler, onPageChangeHandler, onPerPageChangeHandler } = useTable();

    const preparedFilters = useMemo(() => {
        const { type, ...restFilters } = filters;

        const types = (() => {
            if (type === 'custom') {
                return [BalanceType.CUSTOM_INTERNAL_WALLET];
            }

            if (type === 'system') {
                return SYSTEM_WALLET_TYPES.filter(t => t !== BalanceType.CUSTOM_INTERNAL_WALLET);
            }

            return SYSTEM_WALLET_TYPES;
        })();

        return {
            ...INITIAL_FILTERS,
            ...restFilters,
            types,
        };
    }, [filters]);

    const { data: walletsPaginateData, isSuccess, isError, isLoading } = useGetBalancesWithPaginateQuery(preparedFilters);

    useEffect(() => {
        if (isError) {
            toast.error<string>(t('upload-wallets-error-notification'));
        }
    }, [isError]);

    const columns = useMemo<TableColumn<FinancialBalanceData>[]>(
        () => [
            {
                key: 'name',
                name: t('wallet-column-name'),
                isSortable: true,
                cellRender: ({ row: { name, type, publicId } }) => {
                    const isCustomWallet = type === BalanceType.CUSTOM_INTERNAL_WALLET;
                    const pathname = isCustomWallet ? `/admin/accounting/wallets/custom-wallet/${publicId}` : `/admin/accounting/wallets/${toKebabCase(type)}`;

                    return (
                        <Link href={{ pathname }} className={cn('cell', { name: true })}>
                            <h4>{name}</h4>
                        </Link>
                    );
                },
            },
            {
                key: 'balance',
                name: t('balance-column-name'),
                cellRender: ({ row: { balance } }) => <WalletAmountBlock balance={balance} view='bold' />,
            },
            {
                key: 'pending_deposit',
                name: t('pending-deposit-column-name'),
                cellRender: ({ row: { pendingDeposit } }) => <WalletAmountBlock balance={pendingDeposit} />,
            },
            {
                key: 'pending_withdrawal',
                name: t('pending-withdrawal-column-name'),
                cellRender: ({ row: { pendingWithdrawal } }) => <WalletAmountBlock balance={pendingWithdrawal} />,
            },
            {
                key: 'type',
                name: t('type-column-name'),
                cellRender: ({ row: { type } }) => {
                    const isCustomWallet = type === BalanceType.CUSTOM_INTERNAL_WALLET;

                    return <>{isCustomWallet ? t('custom-label') : t('system-label')}</>;
                },
            },
            {
                key: 'fee_categories',
                name: t('assigned-fees-column-name'),
                cellRender: ({ row: { feeCategories } }) =>
                    feeCategories.length > 0 ? (
                        <div className={cn('cell', { fees: true })}>
                            {feeCategories.map(feeCategory => (
                                <p key={feeCategory.id}>{feeCategory.name}</p>
                            ))}
                        </div>
                    ) : (
                        <>—</>
                    ),
            },
            {
                key: 'created_at',
                name: t('created-at-column-name'),
                isSortable: true,
                cellRender: ({ row: { createdAt } }) => <DateInfo date={createdAt} inline={true} />,
                headerCellClassName: cn('cell', { 'created-at': true }),
            },
            {
                key: 'actions',
                name: '',
                cellRender: ({ row: { publicId, name, type } }) => {
                    if (type !== BalanceType.CUSTOM_INTERNAL_WALLET) return null;

                    return (
                        <TableRowMenu
                            dataTestId='wallets-table-actions'
                            options={[
                                {
                                    label: t('edit'),
                                    onClick: () =>
                                        dispatch(accountingActions.setCreateWalletPopupProps({ isPopupOpened: true, walletId: publicId, walletName: name })),
                                },
                            ]}
                        />
                    );
                },
            },
        ],
        [dispatch],
    );

    return {
        isLoading,
        filters,
        columns,
        walletsPaginateData,
        isSuccess,
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
    };
};
