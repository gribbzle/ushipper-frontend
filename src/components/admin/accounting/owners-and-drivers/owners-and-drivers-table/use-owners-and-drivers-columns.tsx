import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

import {
    AppAndDeviceInfo,
    CompanyRatingWithReviewCount,
    DateInfo,
    DriverAccountInfoBlock,
    PhoneEmailInfo,
    TableColumn,
    TableRowMenu,
} from '@/components/common';
import { BalanceType, CompanyType } from '@/enums';
import { useDriversActionsPermission } from '@hooks';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { AccountingAccountData, accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { usePartiallyUpdateAccountMutation } from '@store/api/accounts-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import { AccountBalanceInfo, AddDriverToCompanyButton, CompaniesUsersInfo, VerifiedStatusInfo } from '../../common';

import { CustomFeesInfo } from './custom-fees-info';
import { LatestLocationInfo } from './latest-location-block';
import { OrdersInfoBlock } from './orders-info-block';
import { MarkAsVerifiedParams } from './owners-and-drivers-table.types';
import { PaymentDetailsBlock } from './payment-details-block';
import { TransactionsInfoBlock } from './transactions-info-block';
import { useOnRowClickHandler } from './use-on-row-click-handler';
import { translateAccountVerificationError, translateAccountVerificationSuccess } from './utils';

import './owners-and-drivers-table.scss';

const t = translateByNamespace('admin:accounting:owners-and-drivers:table');
const tTable = translateByNamespace('common:staff-table');
const tStatus = translateByNamespace('admin:accounting:balance-table');

const cn = classname('owners-and-drivers-table');

export const useOwnersAndDriversColumns = () => {
    const hasDriversActionsPermission = useDriversActionsPermission();
    const dispatch = useAppDispatch();
    const [updateAccount] = usePartiallyUpdateAccountMutation();

    const onDeleteClickHandler = useCallback(
        async (account: AccountingAccountData) => {
            dispatch(accountingActions.setDeleteAccountPopupProps({ isPopupOpened: true, accountId: account.publicId, accountName: account.name }));
        },
        [dispatch],
    );

    const onMarkAsVerifiedClickHandler = useCallback(
        async ({ mode, accountId }: MarkAsVerifiedParams) => {
            try {
                const currentDate = new Date().toISOString();
                const data = mode === 'email' ? { emailVerifiedAt: currentDate } : { phoneVerifiedAt: currentDate };

                await updateAccount({ accountId, data }).unwrap();

                dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
                toast.success(translateAccountVerificationSuccess(mode));
            } catch {
                toast.error(translateAccountVerificationError(mode));
            }
        },
        [dispatch, updateAccount],
    );

    const onRowClickHandler = useOnRowClickHandler();

    const columns = useMemo<TableColumn<AccountingAccountData>[]>(
        () => [
            {
                key: 'id',
                name: tTable('id-column-name'),
                isSortable: true,
            },

            {
                key: 'owner_name',
                name: tTable('user-and-role-column-name'),
                isSortable: true,
                cellRender: ({ row: { publicId, name, childrenCount, parent, ownerUser } }) => (
                    <DriverAccountInfoBlock publicId={publicId} childrenCount={childrenCount} parent={parent} ownerUser={ownerUser} name={name} />
                ),

                headerCellClassName: cn('driver-owner'),
            },
            {
                key: 'phone_and_email',
                name: tTable('phone-and-email-column-name'),
                cellRender: ({ row: { phone, email, phoneVerifiedAt, emailVerifiedAt } }) => (
                    <PhoneEmailInfo phone={phone} email={email} phoneVerifiedAt={phoneVerifiedAt} emailVerifiedAt={emailVerifiedAt} showVerifiedInfo={true} />
                ),
            },
            {
                key: 'fees',
                name: t('fees-column-name'),
                cellRender: ({ row: { fees, parent, users } }) => (!parent ? <CustomFeesInfo fees={fees} users={users} /> : '—'),
                headerCellClassName: cn('fees'),
            },
            {
                key: 'default_balance',
                name: t('account-balance-column-name'),
                isSortable: true,
                cellRender: ({ row: { balances, publicId, orders } }) => (
                    <AccountBalanceInfo balances={balances} accountPublicId={publicId} pendingBalance={orders.pendingSum} />
                ),
                headerCellClassName: cn('account-balance'),
            },
            {
                key: 'cash_out_transactions_sum_amount',
                name: t('transactions-column-name'),
                isSortable: true,
                cellRender: ({ row: { transactions, publicId } }) => <TransactionsInfoBlock transactions={transactions} accountId={publicId} />,
            },
            {
                key: 'companies',
                name: tTable('companies-column-name'),
                isSortable: true,
                cellRender: ({ row: { users, emailVerifiedAt, name, email } }) => {
                    const carrierUsers = users.filter(({ company }) => company && company.type === CompanyType.CARRIER);

                    if (!!carrierUsers.length) {
                        return <CompaniesUsersInfo info={carrierUsers} isClickable={true} />;
                    }

                    if (!hasDriversActionsPermission) {
                        return <>—</>;
                    }

                    return <AddDriverToCompanyButton disabled={!!emailVerifiedAt} name={name} email={email} />;
                },
            },
            {
                key: 'status',
                name: tStatus('status-column-title'),
                isSortable: true,
                cellRender: ({ row }) => <VerifiedStatusInfo info={row} disabled={!hasDriversActionsPermission} />,
            },
            {
                key: 'driver_orders_count',
                name: t('total-orders'),
                isSortable: true,
                cellRender: ({
                    row: {
                        orders: { total },
                        publicId,
                    },
                }) => <OrdersInfoBlock type='total' value={total} accountId={publicId} />,
                headerCellClassName: cn('orders'),
            },
            {
                key: 'driver_orders_pending_count',
                name: t('pending-orders'),
                isSortable: true,
                cellRender: ({
                    row: {
                        orders: { pending },
                        publicId,
                    },
                }) => <OrdersInfoBlock type='pending' value={pending} accountId={publicId} />,
                headerCellClassName: cn('orders'),
            },
            {
                key: 'driver_orders_requested_count',
                name: t('doc-request-orders'),
                isSortable: true,
                cellRender: ({
                    row: {
                        orders: { documentsRequested },
                        publicId,
                    },
                }) => <OrdersInfoBlock type='documentsRequested' value={documentsRequested} accountId={publicId} />,
                headerCellClassName: cn('orders'),
            },
            {
                key: 'driver_orders_claimed_count',
                name: t('damages-orders'),
                isSortable: true,
                cellRender: ({
                    row: {
                        orders: { damageClaimed },
                        publicId,
                    },
                }) => <OrdersInfoBlock type='damageClaimed' value={damageClaimed} accountId={publicId} />,
                headerCellClassName: cn('orders'),
            },
            {
                key: 'payment_details',
                name: t('payment-details-column-name'),
                cellRender: ({ row: { balances } }) => {
                    const filteredBalances = balances.filter(balance => balance.type !== BalanceType.INTERNAL_USER_WALLET);

                    return filteredBalances.length > 0 ? <PaymentDetailsBlock balances={filteredBalances} /> : '—';
                },
                headerCellClassName: cn('payment-details'),
            },
            {
                key: 'rating_count',
                name: tTable('rating-column-name'),
                cellRender: ({ row: { rating } }) => <CompanyRatingWithReviewCount rating={rating?.driverRating} reviewsTotal={rating?.driverReviewsTotal} />,
                headerCellClassName: cn('rating'),
            },
            {
                key: 'device_information',
                name: tTable('app-and-device-column-name'),
                cellRender: ({ row: { deviceInformation } }) => <AppAndDeviceInfo info={deviceInformation} />,
                headerCellClassName: cn('device-information'),
            },
            {
                key: 'latest_location',
                name: t('latest-location-column-name'),
                cellRender: ({ row: { latestLocation, name, users, publicId } }) => (
                    <LatestLocationInfo latestLocation={latestLocation} accountName={name} users={users} accountId={publicId} />
                ),
                headerCellClassName: cn('latest-location'),
            },
            {
                key: 'created_at',
                name: tTable('created-at-column-name'),
                isSortable: true,
                cellRender: ({ row: { createdAt } }) => <DateInfo date={createdAt} />,
                headerCellClassName: cn('created-at'),
            },
            {
                key: 'updated_at',
                name: tTable('updated-at-column-name'),
                isSortable: true,
                cellRender: ({ row: { createdAt } }) => <DateInfo date={createdAt} />,
                headerCellClassName: cn('updated-at'),
            },
            {
                key: 'actions',
                name: '',
                hide: !hasDriversActionsPermission,
                cellRender: ({ row }) => {
                    return (
                        <TableRowMenu
                            dataTestId='owners-and-drivers-table-actions'
                            options={[
                                {
                                    label: t('mark-email-as-verified-button-label'),
                                    onClick: () => onMarkAsVerifiedClickHandler({ mode: 'email', accountId: row.publicId }),
                                    show: !row.emailVerifiedAt,
                                },
                                {
                                    label: t('mark-phone-number-as-verified-button-label'),
                                    onClick: () => onMarkAsVerifiedClickHandler({ mode: 'phone', accountId: row.publicId }),
                                    show: !row.phoneVerifiedAt,
                                },
                                {
                                    label: tTable('edit-button-label'),
                                    onClick: () => onRowClickHandler(row),
                                },
                                {
                                    label: tTable('delete-button-label'),
                                    onClick: () => onDeleteClickHandler(row),
                                },
                            ]}
                        />
                    );
                },
            },
        ],
        [hasDriversActionsPermission, onDeleteClickHandler, onMarkAsVerifiedClickHandler, onRowClickHandler],
    );

    return { columns };
};
