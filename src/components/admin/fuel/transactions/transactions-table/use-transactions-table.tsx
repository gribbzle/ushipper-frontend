import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Link } from '@/components/common/link/link';
import { DateInfo } from '@/components/common/table/common/date-info/date-info';
import { HelperText } from '@/components/common/table/common/helper-text/helper-text';
import { TableColumn } from '@/components/common/table/table.types';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { hasAddress } from '@/utils/order';
import { OrderSortingDirection } from '@enums';
import { useQueryFilters, useTable } from '@hooks';
import { useAppDispatch } from '@store';
import { fuelActions, FuelTransaction } from '@store/admin';
import { GetFuelTransactionsParams, useGetFuelTransactionsQuery } from '@store/api/fuel-cards-api';
import { classname } from '@utils/classname';
import { convertToStringArray } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

import { FuelTransactionStatusTag } from '../fuel-transaction-status-tag';

import { FuelTransactionQuantityInfo } from './fuel-transaction-quantity-info';
import { FuelTransactionSummary } from './fuel-transaction-summary';

import './transactions-table.scss';

const FUEL_TRANSACTIONS_PARAMS: Partial<GetFuelTransactionsParams> = {
    orderDirection: OrderSortingDirection.DESC,
    orderName: 'created_at',
};

const cn = classname('fuel-transactions-table');
const t = translateByNamespace('admin:fuel:transactions-page:table');
const tTable = translateByNamespace('common:staff-table');
const tNot = translateByNamespace('admin:fuel:transactions-page:notifications');

export const useTransactionsTable = () => {
    const dispatch = useAppDispatch();
    const { filters } = useQueryFilters<GetFuelTransactionsParams>(FUEL_TRANSACTIONS_PARAMS);

    const { onPageChangeHandler, onPerPageChangeHandler, onOrderChangeHandler } = useTable();

    const { statuses, ...otherFilters } = filters;

    const {
        data: cardsPaginateData,
        isSuccess,
        isError,
        isLoading,
    } = useGetFuelTransactionsQuery({
        ...FUEL_TRANSACTIONS_PARAMS,
        ...otherFilters,
        statuses: convertToStringArray(statuses),
    });

    useEffect(() => {
        if (isError) {
            toast.error<string>(tNot('upload-fuel-transactions-error-notification'));
        }
    }, [isError]);

    const handleOpenFuelTransactionDetailsDrawer = useCallback(
        (fuelTransaction: FuelTransaction) => dispatch(fuelActions.setFuelTransactionDetailsDrawerProps({ isPopupOpened: true, fuelTransaction })),
        [dispatch],
    );

    const columns = useMemo<TableColumn<FuelTransaction>[]>(
        () => [
            {
                key: 'external_id',
                name: t('external-id-column-name'),
                isSortable: true,
                cellRender: ({ row }) => (
                    <p onClick={() => handleOpenFuelTransactionDetailsDrawer(row)} className={cn('link')}>
                        {row.externalId}
                    </p>
                ),
            },
            {
                key: 'card_number',
                name: t('fuel-card-column-name'),
                isSortable: true,
                cellRender: ({ row: { cardNumber, fuelCard } }) => (
                    <div className={cn('card-number')}>
                        <Link href={{ pathname: '/admin/fuel/cards', query: { number: cardNumber } }} target='_blank'>
                            {cardNumber}
                        </Link>
                        <HelperText text={fuelCard.wexAccount} />
                    </div>
                ),
            },
            {
                key: 'driver',
                name: t('driver-column-name'),
                cellRender: ({ row: { fuelCard } }) => {
                    const { account } = fuelCard;

                    if (!account) {
                        return <>—</>;
                    }
                    const handleDriverClick = (name: string) => window.open(`/admin/accounting/drivers?name=${encodeURIComponent(name)}`, '_blank');
                    const { name, publicId, defaultBalance, avatar, parent } = account;

                    return (
                        <UserInfoBlock
                            name={name}
                            avatar={avatar}
                            onNameClick={() => handleDriverClick(name)}
                            showChatButton={true}
                            accountPublicId={publicId}
                            showBalance={true}
                            balance={defaultBalance}
                            parent={parent}
                        />
                    );
                },
                headerCellClassName: cn('driver'),
            },
            {
                key: 'status',
                name: tTable('status-column-name'),
                isSortable: true,
                cellRender: ({ row: { status, id } }) => <FuelTransactionStatusTag status={status} transactionId={id} />,
            },
            {
                key: 'funded_total',
                name: t('total-amount-column-name'),
                isSortable: true,

                cellRender: ({ row: { fundedTotal, discountAmount, rawData } }) => (
                    <FuelTransactionSummary fundedTotal={fundedTotal} discountAmount={discountAmount} info={rawData?.lineItems} mode='total' />
                ),
            },
            {
                key: 'discount_amount',
                name: t('discount-amount-column-name'),
                isSortable: true,
                cellRender: ({ row: { discountAmount, rawData } }) => (
                    <FuelTransactionSummary discountAmount={discountAmount} info={rawData?.lineItems} mode='discount' />
                ),
            },
            {
                key: 'quantity',
                name: t('quantity-column-name'),
                cellRender: ({ row: { rawData } }) => (rawData ? <FuelTransactionQuantityInfo info={rawData.lineItems} /> : <>—</>),
            },
            {
                key: 'location',
                name: t('location-column-name'),
                cellRender: ({ row: { location } }) => {
                    const { city, zip, state } = location;

                    const addressParts = [city, state, zip].filter(Boolean);
                    const addressLabel = addressParts.length ? addressParts.join(', ') : '—';

                    const openGoogleMap = () => {
                        window.open(`https://www.google.com/maps/dir/${encodeURIComponent(addressLabel)}}`, '_blank');
                    };

                    if (!hasAddress(location)) {
                        return <>—</>;
                    }

                    return (
                        <span onClick={openGoogleMap} className={cn('link')}>
                            {addressLabel}
                        </span>
                    );
                },
            },
            {
                key: 'happened_at',
                name: t('happened-at-column-name'),
                isSortable: true,
                cellRender: ({ row: { happenedAt } }) => <DateInfo date={happenedAt} />,
                headerCellClassName: cn('happened-at'),
            },
            {
                key: 'created_at',
                name: tTable('created-at-column-name'),
                isSortable: true,
                cellRender: ({ row: { createdAt } }) => <DateInfo date={createdAt} />,
                headerCellClassName: cn('created-at'),
            },
        ],
        [handleOpenFuelTransactionDetailsDrawer],
    );

    return { isLoading, columns, cardsPaginateData, isSuccess, filters, onPageChangeHandler, onPerPageChangeHandler, onOrderChangeHandler };
};
