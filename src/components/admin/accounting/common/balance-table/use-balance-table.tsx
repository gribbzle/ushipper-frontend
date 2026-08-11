import React, { useEffect } from 'react';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

import { AmountInfoBlock } from '@/components/common/table/common/amount-info-block/amount-info-block';
import { DescriptionInfoBlock } from '@/components/common/table/common/description-info-block/description-info-block';
import { PriceAndReceiptPhotos } from '@/components/common/table/common/price-and-receipt-photos/price-and-receipt-photos';
import { TableColumn } from '@/components/common/table/table.types';
import { TransactionTimeInfoBlock } from '@/components/common/table/common/transaction-time-info-block/transaction-time-info-block';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { PaymentConfirmationType } from '@/enums/transactions/payment-confirmation-type';
import { TransactionStatusesEnum } from '@/enums/transactions/transaction-statuses-enum';
import { useIsTransactionsPage } from '@/hooks/accounting/use-is-transactions-page';
import { useQueryFilters } from '@/hooks/filters/use-query-filters';
import { useTable } from '@/hooks/use-table';
import { Transaction } from '@store/admin';
import { TransactionsFiltersParams, useGetTransactionsQuery } from '@store/api/transactions-api';
import { TransactionsFiltersState } from '@/types/transactions';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isCashIn, isCashOut } from '@utils/transaction/get-is-cash-in-cash-out';
import { translateCompanyType } from '@utils/translations';

import { BalanceTableProps } from './balance-table.types';
import { MoveBalanceInfoBlock } from './move-balance-info-block';
import { StatusColumn } from './status-column';

const t = translateByNamespace('admin:accounting:balance-table');
const cn = classname('balance-table');

export const transformFilters = (filters: TransactionsFiltersParams) => {
    const modifiedFilters = { ...filters };

    if (filters.type === 'cash-in') {
        modifiedFilters.sourceTypeGroup = 'user_external';
        delete modifiedFilters.type;
    } else if (filters.type === 'cash-out') {
        modifiedFilters.destinationTypeGroup = 'user_external';
        delete modifiedFilters.type;
    }

    return modifiedFilters;
};

export const useBalanceTable = ({ balanceType, balanceId }: BalanceTableProps) => {
    const isTransactionsPage = useIsTransactionsPage();
    const { filters } = useQueryFilters<TransactionsFiltersState>({ orderDirection: OrderSortingDirection.DESC });
    const { onOrderChangeHandler, onPageChangeHandler, onPerPageChangeHandler } = useTable();

    const transformedFilters = useMemo(() => transformFilters(filters), [filters]);
    const accountIdFilter = useMemo(() => transformedFilters?.accountId, [transformedFilters]);

    const {
        data: transactionsPaginateData,
        isSuccess,
        isError,
        isLoading,
    } = useGetTransactionsQuery({ ...transformedFilters, ...(balanceType ? { balanceType } : undefined), ...(balanceId && { balanceId }) });

    useEffect(() => {
        if (isError) {
            toast.error<string>(t('upload-transactions-error-notification'));
        }
    }, [isError]);

    const transactionsColumns = useMemo<TableColumn<Transaction>[]>(
        () => [
            {
                key: 'created_at',
                name: t('transaction-time-column-title'),
                isSortable: true,
                cellRender: ({ row }: { row: Transaction }) => <TransactionTimeInfoBlock time={row.createdAt} id={row.publicId} />,
            },
            {
                key: 'source_balance',
                name: t('from-column-title'),
                cellRender: ({ row }: { row: Transaction }) => <MoveBalanceInfoBlock balance={row.sourceBalance} />,
            },
            {
                key: 'destination_balance',
                name: t('to-column-title'),
                cellRender: ({ row }: { row: Transaction }) => <MoveBalanceInfoBlock balance={row.destinationBalance} />,
            },
            {
                key: 'amount',
                name: t('amount-column-title'),
                cellRender: ({ row }: { row: Transaction }) => {
                    const { sourceBalance, destinationBalance, type, amount, status } = row;
                    const isCancelledStatus = status === TransactionStatusesEnum.CANCELLED;
                    const isSameSourceAccount = sourceBalance?.accountId === accountIdFilter;
                    const cashIn = isCashIn({ confirmation: type, sourceType: sourceBalance?.type });
                    const cashOut = isCashOut({ confirmation: type, destinationType: destinationBalance?.type });
                    const includePlus = !!accountIdFilter && (cashIn || cashOut) && status !== TransactionStatusesEnum.COMPLETED && !isCancelledStatus;
                    const disabled = !accountIdFilter || isCancelledStatus || includePlus;

                    let value = Number(amount.amount);

                    if (accountIdFilter && !isCancelledStatus && isSameSourceAccount && !cashIn) {
                        value = -1 * value;
                    }

                    return <AmountInfoBlock value={value} disabled={disabled} includePlus={includePlus} warning={status === TransactionStatusesEnum.PENDING} />;
                },
            },
            {
                key: 'status',
                name: t('status-column-title'),
                cellRender: ({ row }: { row: Transaction }) => (
                    <StatusColumn
                        status={row.status}
                        publicId={row.publicId}
                        destinationBalance={row.destinationBalance}
                        sourceBalance={row.sourceBalance}
                        type={row.type}
                        entity={row.entity}
                        amount={row.amount}
                        externalProvider={row.externalProvider}
                    />
                ),
            },
            {
                key: 'type_and_description',
                name: t('description-column-title'),
                cellRender: ({ row }: { row: Transaction }) => {
                    const { type, entity, metadata } = row;

                    const isOrderPaymentConfirmationCheckTransaction = type === PaymentConfirmationType.ORDER_PAYMENT_CONFIRMED_CHECK;

                    const { publicId: orderPublicId, orderId } = entity?.data || {};
                    const price = metadata?.baseAmount?.formatted;

                    return (
                        <div className={cn('type-and-description')}>
                            <DescriptionInfoBlock {...row} showExternalInfo={true} showDriverInfo={true} showReasonAccount={true} />
                            {isOrderPaymentConfirmationCheckTransaction && (
                                <PriceAndReceiptPhotos disabled={false} price={price} orderPublicId={orderPublicId} orderId={orderId} />
                            )}
                        </div>
                    );
                },
            },
        ],
        [accountIdFilter],
    );

    const balanceColumns = useMemo<TableColumn<Transaction>[]>(
        () => [
            {
                key: 'created_at',
                name: t('transaction-time-column-title'),
                isSortable: true,
                cellRender: ({ row: { createdAt, publicId } }) => <TransactionTimeInfoBlock time={createdAt} id={publicId} />,
            },
            {
                key: 'amount',
                name: t('amount-column-title'),
                cellRender: ({ row: { amount, status } }) => (
                    <AmountInfoBlock value={Number(amount.amount)} warning={status === TransactionStatusesEnum.PENDING} />
                ),
            },
            {
                key: 'amount_before',
                name: t('balance-before-column-title'),
                cellRender: ({ row }: { row: Transaction }) => row.amountBefore?.formatted ?? '—',
            },
            {
                key: 'type_and_description',
                name: t('description-column-title'),
                cellRender: ({ row }: { row: Transaction }) => <DescriptionInfoBlock {...row} showDriverInfo={false} showReasonAccount={false} showExternalInfo={true} />,
            },
            {
                key: 'status',
                name: t('status-column-title'),
                cellRender: ({ row }: { row: Transaction }) => (
                    <StatusColumn
                        status={row.status}
                        publicId={row.publicId}
                        destinationBalance={row.destinationBalance}
                        sourceBalance={row.sourceBalance}
                        type={row.type}
                        entity={row.entity}
                        amount={row.amount}
                        externalProvider={row.externalProvider}
                    />
                ),
            },
            {
                key: 'company',
                name: t('company-column-title'),
                cellRender: ({ row }: { row: Transaction }) => {
                    const company = row.entity?.data?.company;

                    return company ? <UserInfoBlock name={company.name} avatar={company.owner.avatar} role={translateCompanyType(company.type)} /> : '—';
                },
            },
            {
                key: 'owner_or_driver',
                name: t('owner-or-driver-column-title'),
                cellRender: ({ row }: { row: Transaction }) => {
                    const { entity, type, reasonAccount } = row;
                    const handleDriverClick = (name: string) => window.open(`/admin/accounting/drivers?name=${encodeURIComponent(name)}`, '_blank');

                    if (type === PaymentConfirmationType.RECURRING_TRANSACTION) {
                        if (!reasonAccount) return <>—</>;

                        const { ownerUser, name, publicId } = reasonAccount;

                        return (
                            <UserInfoBlock
                                name={name}
                                roleName={t('driver-label')}
                                avatar={ownerUser?.avatar ?? null}
                                onNameClick={() => handleDriverClick(name)}
                                showChatButton={true}
                                accountPublicId={publicId}
                            />
                        );
                    }
                    const driver = entity?.data?.driver;

                    return driver ? <UserInfoBlock {...driver} onNameClick={() => handleDriverClick(driver.name)} showChatButton={true} /> : '—';
                },
            },
        ],
        [],
    );

    return {
        isLoading,
        filters,
        columns: isTransactionsPage ? transactionsColumns : balanceColumns,
        transactionsPaginateData,
        isSuccess,
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
    };
};
