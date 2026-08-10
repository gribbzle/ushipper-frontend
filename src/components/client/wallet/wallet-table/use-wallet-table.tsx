import React, { useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { AmountInfoBlock } from '@/components/common/table/common/amount-info-block/amount-info-block';
import { DescriptionInfoBlock } from '@/components/common/table/common/description-info-block/description-info-block';
import { PriceAndReceiptPhotos } from '@/components/common/table/common/price-and-receipt-photos/price-and-receipt-photos';
import { TransactionStatusTag } from '@/components/common/table/common/transaction-status-tag/transaction-status-tag';
import { TransactionTimeInfoBlock } from '@/components/common/table/common/transaction-time-info-block/transaction-time-info-block';
import { TableColumn } from '@/components/common/table/table.types';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { PaymentConfirmationType } from '@/enums/transactions/payment-confirmation-type';
import { TransactionStatusesEnum } from '@/enums/transactions/transaction-statuses-enum';
import { useQueryFilters, useTable } from '@hooks';
import { useAppSelector } from '@store';
import { Transaction } from '@store/admin';
import { useGetTransactionsQuery } from '@store/api/transactions-api';
import { authorizedUserDefaultBalanceSelector } from '@store/global';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('client:wallet-page:wallet-table');
const tNotification = translateByNamespace('client:wallet-page:notifications');
const cn = classname('wallet-table');

export const useWalletTable = () => {
    const { filters } = useQueryFilters({ orderDirection: OrderSortingDirection.DESC });
    const { onOrderChangeHandler, onPageChangeHandler, onPerPageChangeHandler } = useTable();
    const balance = useAppSelector(authorizedUserDefaultBalanceSelector);

    const {
        data: transactionsPaginateData,
        isSuccess,
        isFetching,
        isError,
    } = useGetTransactionsQuery({ ...filters, balanceId: balance?.publicId }, { skip: !balance?.publicId });

    const columns = useMemo<TableColumn<Transaction>[]>(
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
                key: 'status',
                name: t('status-column-title'),
                cellRender: ({ row: { amount, status, publicId, type, destinationBalance, sourceBalance, externalProvider } }) => (
                    <TransactionStatusTag
                        amount={amount}
                        externalProvider={externalProvider}
                        status={status}
                        publicId={publicId}
                        destinationBalance={destinationBalance}
                        sourceBalance={sourceBalance}
                        type={type}
                        isClickable={false}
                    />
                ),
            },
            {
                key: 'description',
                name: t('description-column-title'),
                cellRender: ({ row }) => {
                    const { type, entity, metadata } = row;
                    const isOrderPaymentConfirmationCheckTransaction = type === PaymentConfirmationType.ORDER_PAYMENT_CONFIRMED_CHECK;
                    const { publicId: orderPublicId, orderId } = entity?.data || {};
                    const price = metadata?.baseAmount?.formatted;

                    return (
                        <div className={cn('type-and-description')}>
                            <DescriptionInfoBlock {...row} showDriverInfo={true} showReasonAccount={true} showExternalInfo={false} />
                            {isOrderPaymentConfirmationCheckTransaction && (
                                <PriceAndReceiptPhotos price={price} orderPublicId={orderPublicId} orderId={orderId} />
                            )}
                        </div>
                    );
                },
            },
        ],
        [],
    );

    useEffect(() => {
        if (isError) {
            toast.error<string>(tNotification('upload-transactions-error'));
        }
    }, [isError]);

    return {
        filters,
        columns,
        transactionsPaginateData,
        isSuccess,
        isFetching,
        onPageChangeHandler,
        onPerPageChangeHandler,
        onOrderChangeHandler,
    };
};
