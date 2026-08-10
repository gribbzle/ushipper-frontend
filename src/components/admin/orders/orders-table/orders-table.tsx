import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import { DeclineOrPayToDriverPopup } from '@/components/admin/accounting/cod-orders/declined-or-pay-to-driver-popup/declined-or-pay-to-driver-popup';
import { AssignDispatcherToDriverPopup } from '@/components/admin/accounting/common/assign-dispatcher-to-driver-popup/assign-dispatcher-to-driver-popup';
import { CreateTransactionPopup } from '@/components/admin/accounting/common/create-transaction-popup/create-transaction-popup';
import { DeleteAccountPopup } from '@/components/admin/accounting/common/delete-account-popup/delete-account-popup';
import { AccountingDrawer } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/accounting-drawer';
import { EditFinancialAccountPopup } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/financial-accounts/edit-financial-account-popup/edit-financial-account-popup';
import { EditRocketkorProfileAccountPopup } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/rocketkor/edit-rocketkor-profile-popup/edit-rocketkor-profile-popup';
import { AddDriverToCompanyPopup } from '@/components/admin/accounting/owners-and-drivers/add-driver-to-company-popup/add-driver-to-company-popup';
import { DriversMapPopup } from '@/components/admin/accounting/owners-and-drivers/drivers-map-popup/drivers-map-popup';
import { LinkFuelCardPopup } from '@/components/admin/accounting/owners-and-drivers/link-fuel-card-popup/link-fuel-card-popup';
import { ReportPopup } from '@/components/admin/accounting/owners-and-drivers/report-popup/report-popup';
import { EditFuelCardPopup } from '@/components/admin/fuel/cards/edit-fuel-card-popup/edit-fuel-card-popup';
import { UnassignDriverFromFuelCardPopup } from '@/components/admin/fuel/cards/unassign-fuel-card-from-driver-popup/unassign-fuel-card-from-driver-popup';
import { MarkAsDocumentsRequestedPopup } from '@/components/admin/orders/mark-as-documents-requested-popup/mark-as-documents-requested-popup';
import { OrderDriverPaymentFormDrawer } from '@/components/client/orders/drawers/order-driver-payment-form-drawer/order-driver-payment-form-drawer';
import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { DeleteUserPopup } from '@/components/client/staff/delete-user-popup/delete-user-popup';
import { InitiateAccountPaymentMethodsPopup } from '@/components/common/initiate-account-payment-methods-popup/initiate-account-payment-methods-popup';
import { AdminOrderIdInfo } from '@/components/common/table/common/admin-order-id-info/admin-order-id-info';
import { CodCopOrdersActionTag } from '@/components/common/table/common/cod-cop-order-action-tag/cod-cop-order-action-tag';
import { DateInfo } from '@/components/common/table/common/date-info/date-info';
import { OrderPriceInfo } from '@/components/common/table/common/order-price-info/order-price-info';
import { Table } from '@/components/common/table/table';
import type { TableColumn, TablePaginationProps } from '@/components/common/table/table.types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/common/tooltip/tooltip';
import { UserInfoBlock } from '@/components/common/user-info-block/user-info-block';
import { AttachmentType } from '@/enums/attachment-types-enum';
import { BalanceType } from '@/enums/balance-type';
import { OrderType } from '@/enums/order/order-type';
import { useDriversViewPermission, useHandleOpenAccountingDrawerClick } from '@hooks';
import { OrderProvider } from '@/providers/OrderProvider';
import { GetOrdersData } from '@store/api/orders-api';
import { Load } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX, isUshipper } from '@utils/project-config';
import { translateDeletedOrderStatus, translateOrderStatus } from '@utils/translate/order/get-order-status-translate';

import { AddressInfoBlock } from './address-info-block';
import { AttachmentsInfo } from './attachments-info';
import { CheckAttachmentInfo } from './check-attachment-info';
import { OrderCompanyInfo } from './company-info';
import { ContractInfo } from './contract-info';
import { PaymentStatusInfo } from './payment-status-info';

import './orders-table.scss';

const cn = classname('orders-table');

const tColumnTitle = translateByNamespace('admin:orders-page:table-columns-title');

type Props = {
    data: Load[];
    ordersType: OrderType;
    filters: GetOrdersData;
    context?: 'cod-cop' | 'orders';
    headerTableSticky?: boolean;
    onOrderChange: (orderName: string, orderDirection: string) => void;
    tablePaginationProps: TablePaginationProps;
};

export const OrdersTable = ({ data, ordersType, filters, context = 'orders', headerTableSticky = false, tablePaginationProps, onOrderChange }: Props) => {
    const onClickHandler = useHandleOpenAccountingDrawerClick();
    const hasDriversViewPermission = useDriversViewPermission();
    const isCODOrdersContext = context === 'cod-cop';
    const isOrdersContext = context === 'orders';
    const isCarrierOrders = useMemo((): boolean => isOrdersContext && ordersType === OrderType.CARRIER, [isOrdersContext, ordersType]);
    const isShipperOrders = useMemo((): boolean => isOrdersContext && ordersType === OrderType.SHIPPER, [isOrdersContext, ordersType]);

    const hideAttachmentColumn = useMemo(
        (): boolean => isCODOrdersContext || (isOrdersContext && !isCarrierOrders),
        [isCODOrdersContext, isOrdersContext, isCarrierOrders],
    );

    const columns = useMemo(
        (): TableColumn<Load>[] => [
            {
                key: 'delivery_date',
                name: tColumnTitle('delivered-at'),
                isSortable: true,
                cellRender: ({ row: { deliveredAt, deliveryInformation } }) => (
                    <DateInfo date={deliveredAt} showWithTimeZone={true} timezone={deliveryInformation?.timezone} />
                ),
                hide: isOrdersContext,
                headerCellClassName: cn('cell', { 'delivered-at': true }),
            },
            {
                key: 'order_id',
                name: tColumnTitle('order-id'),
                isSortable: true,
                cellRender: ({ row: order }) => (
                    <OrderProvider value={order}>
                        <AdminOrderIdInfo showProducts={isCarrierOrders} showPublicId={isShipperOrders} className={cn('cell', { 'order-id': true })} />
                    </OrderProvider>
                ),
            },
            {
                key: 'pickup_location',
                name: tColumnTitle('pickup-location'),
                isSortable: true,
                cellRender: ({ row: { pickupInformation, status, pickedUpAt } }) => (
                    <AddressInfoBlock info={pickupInformation} status={status} pickedUpAt={pickedUpAt} pickedUpAtTimezone={pickupInformation?.timezone} />
                ),
                hide: isCODOrdersContext,
            },
            {
                key: 'delivery_location',
                name: tColumnTitle('delivery-location'),
                isSortable: true,
                cellRender: ({ row: { status, deliveryInformation, deliveredAt } }) => (
                    <AddressInfoBlock
                        info={deliveryInformation}
                        status={status}
                        deliveredAt={deliveredAt}
                        deliveredAtTimezone={deliveryInformation?.timezone}
                    />
                ),
                hide: isCODOrdersContext,
            },
            {
                key: 'status',
                name: tColumnTitle('status'),
                isSortable: true,
                cellRender: ({ row: { status, deletedAt } }) => (
                    <OrderTag view={deletedAt ? 'cancelled' : toKebabCase(status)}>
                        {deletedAt ? translateDeletedOrderStatus() : translateOrderStatus(status)}
                    </OrderTag>
                ),
                hide: isCODOrdersContext,
            },
            {
                key: 'price',
                name: tColumnTitle('price'),
                isSortable: true,
                cellRender: ({ row: order }) => (
                    <OrderProvider value={order}>
                        <OrderPriceInfo showInstantPaymentMethod={isCODOrdersContext} className={cn('cell', { price: true })} />
                    </OrderProvider>
                ),
            },
            {
                key: 'payment_status',
                name: tColumnTitle('payment-status'),
                cellRender: ({ row: order }) => (
                    <OrderProvider value={order}>
                        <PaymentStatusInfo />
                    </OrderProvider>
                ),
                headerCellClassName: cn('cell', { 'payment-status': true }),
                hide: isCODOrdersContext || isShipperOrders,
            },
            {
                key: 'cd_contract',
                name: isFreightX ? (
                    <Tooltip>
                        <TooltipTrigger>{tColumnTitle('rc')}</TooltipTrigger>
                        <TooltipContent>{tColumnTitle('rc-description')}</TooltipContent>
                    </Tooltip>
                ) : (
                    tColumnTitle('contract')
                ),
                hide: hideAttachmentColumn,
                cellRender: ({ row: { publicId } }) => <ContractInfo publicId={publicId} />,
            },
            {
                key: 'bol',
                name: tColumnTitle('bol'),
                hide: hideAttachmentColumn,
                cellRender: ({ row: { publicId } }) => <AttachmentsInfo publicId={publicId} type={AttachmentType.BOL} />,
            },
            {
                key: 'pod',
                name: tColumnTitle('pod'),
                hide: isUshipper || hideAttachmentColumn,
                cellRender: ({ row: { publicId } }) => <AttachmentsInfo publicId={publicId} type={AttachmentType.POD} />,
            },
            {
                key: 'company_name',
                name: tColumnTitle('company'),
                isSortable: true,
                headerCellClassName: cn('cell', { company: true }),
                cellRender: ({ row: order }) => {
                    return isCODOrdersContext ? (
                        <h4 className={cn('column-text')}>{order.company.name}</h4>
                    ) : (
                        <OrderProvider value={order}>
                            <OrderCompanyInfo />
                        </OrderProvider>
                    );
                },
            },
            {
                key: 'driver',
                name: tColumnTitle('driver'),
                cellRender: ({ row: { driver } }) => {
                    const { accountPublicId } = driver || {};

                    return driver ? (
                        <UserInfoBlock
                            avatar={driver.avatar}
                            name={driver.name}
                            nickname={driver.nickname}
                            balance={driver.defaultBalance}
                            parent={driver.parent}
                            accountPublicId={driver.accountPublicId}
                            showBalance={true}
                            showChatButton={isCODOrdersContext}
                            hideAvatar={isCarrierOrders}
                            trimName={isCarrierOrders}
                            onNameClick={isCarrierOrders && hasDriversViewPermission ? () => onClickHandler(accountPublicId) : undefined}
                        />
                    ) : (
                        '—'
                    );
                },
                hide: isShipperOrders,
            },
            {
                key: 'dispatcher',
                name: tColumnTitle('dispatcher'),
                cellRender: ({ row: { dispatcher } }) => {
                    return dispatcher ? (
                        <UserInfoBlock
                            avatar={dispatcher.avatar}
                            name={dispatcher.name}
                            roleName={dispatcher.roleName}
                            trimName={true}
                            hideAvatar={isOrdersContext}
                        />
                    ) : (
                        '—'
                    );
                },
            },
            {
                key: 'receipt_photo',
                name: tColumnTitle('receipt-photo'),
                cellRender: ({ row: { publicId } }) => <CheckAttachmentInfo publicId={publicId} />,
                hide: isOrdersContext,
            },
            {
                key: 'receipt_status',
                name: tColumnTitle('receipt-status'),
                cellRender: ({
                    row: { publicId, instantTermPaymentType, driver, fullPrice, instantTermDeclinedAt, instantTermPaidAt, instantTermPaymentDeclineReason },
                }) =>
                    instantTermPaymentType ? (
                        <CodCopOrdersActionTag
                            className={cn('cell', { 'receipt-status': true })}
                            driverPay={fullPrice}
                            publicId={publicId}
                            driver={driver}
                            instantTermPaymentType={instantTermPaymentType}
                            declinedAt={instantTermDeclinedAt}
                            paidAt={instantTermPaidAt}
                            instantTermPaymentDeclineReason={instantTermPaymentDeclineReason}
                        />
                    ) : (
                        '—'
                    ),
                hide: isOrdersContext,
            },
            {
                key: 'creation_date',
                name: tColumnTitle('created-at'),
                isSortable: true,
                cellRender: ({ row: { createdAt } }) => <DateInfo date={createdAt} />,
                hide: isCODOrdersContext,
                headerCellClassName: cn('cell', { 'created-at': true }),
            },
        ],
        [isOrdersContext, isCODOrdersContext, hideAttachmentColumn, isShipperOrders, isCarrierOrders, hasDriversViewPermission, onClickHandler],
    );

    return (
        <>
            <Table<Load>
                columns={columns}
                data={data}
                className={cn('')}
                onOrderChange={onOrderChange}
                orderName={filters.orderName}
                orderDirection={filters.orderDirection}
                isSticky={headerTableSticky}
                paginationProps={tablePaginationProps}
                stickyColumnsProps={{
                    stickyLeftColumns: isCODOrdersContext ? 2 : 1,
                }}
            />
            {(isCarrierOrders || isCODOrdersContext) && (
                <>
                    <AccountingDrawer />
                    <CreateTransactionPopup context={BalanceType.INTERNAL_USER_WALLET} />
                    <EditFinancialAccountPopup />
                    <AddDriverToCompanyPopup />
                    <AssignDispatcherToDriverPopup />
                    <EditRocketkorProfileAccountPopup />
                    <UnassignDriverFromFuelCardPopup />
                    <DeleteUserPopup />
                    <LinkFuelCardPopup />
                    <EditFuelCardPopup />
                    <DeclineOrPayToDriverPopup />
                </>
            )}
            {isCarrierOrders && (
                <>
                    <InitiateAccountPaymentMethodsPopup />
                    <ReportPopup />
                    <OrderDriverPaymentFormDrawer />
                </>
            )}
            {isCODOrdersContext && (
                <>
                    <DriversMapPopup />
                    <DeleteAccountPopup />
                </>
            )}
            {isOrdersContext && <MarkAsDocumentsRequestedPopup />}
        </>
    );
};
