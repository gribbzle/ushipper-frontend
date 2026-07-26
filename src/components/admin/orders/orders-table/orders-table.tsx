import React, { useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';

import {
    AccountingDrawer,
    AddDriverToCompanyPopup,
    AdminOrderIdInfo,
    AssignDispatcherToDriverPopup,
    CodCopOrdersActionTag,
    CreateTransactionPopup,
    DateInfo,
    DeclineOrPayToDriverPopup,
    DeleteAccountPopup,
    DeleteUserPopup,
    DriversMapPopup,
    EditFinancialAccountPopup,
    EditFuelCardPopup,
    EditRocketkorProfileAccountPopup,
    InitiateAccountPaymentMethodsPopup,
    LinkFuelCardPopup,
    MarkAsDocumentsRequestedPopup,
    OrderDriverPaymentFormDrawer,
    OrderPriceInfo,
    OrderTag,
    ReportPopup,
    Table,
    TableColumn,
    TablePaginationProps,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    UnassignDriverFromFuelCardPopup,
    UserInfoBlock,
} from '@components';
import { AttachmentType, BalanceType, OrderType } from '@enums';
import { useDriversViewPermission, useHandleOpenAccountingDrawerClick } from '@hooks';
import { OrderProvider } from '@providers';
import { GetOrdersData } from '@store/api/orders-api';
import { Load } from '@store/client';
import { classname, isFreightX, isUshipper, translateByNamespace, translateDeletedOrderStatus, translateOrderStatus } from '@utils';

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
