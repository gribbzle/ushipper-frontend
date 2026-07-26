import React from 'react';
import { format } from 'date-fns';
import has from 'has-values';

import { OrderItemHeader } from '@/components/client/orders/order-item/order-item-header';
import { OrderActions, OrderDriverPaymentFormAlert, Paper } from '@components';
import { useIsPartnerCompany, useMeAdmin, useMeDriverRelated } from '@hooks';
import { Load } from '@store/client';
import { classname, getOrderProducts, renderProjectSpecificComponent, translateByNamespace } from '@utils';

import { OrderAdditionalDocumentsAlert } from '../alerts';
import { OrderItemCommoditiesList } from '../order-item-commodities-list';
import { OrderItemVehiclesList } from '../order-item-vehicles-list';

import { DriverDispatcherInfo } from './driver-dispatcher-info/driver-dispatcher-info';
import { useOrderItem } from './hooks';
import { OrderItemInfo } from './info';

import './order-item.scss';

const t = translateByNamespace('client:orders-page:order-item');
const cn = classname('order-item');

type OrderItemProps = {
    order: Load;
};

export const OrderItem = ({ order }: OrderItemProps) => {
    const {
        publicId,
        details,
        customerInformation,
        deliveryInformation,
        paymentInformation,
        pickupInformation,
        latestInternalNote,
        status,
        dispatcher,
        driver,
        paidAt,
        sendInvoiceAt,
        pickedUpAt,
        deliveredAt,
        instantTermPaymentType,
        fundsTransferStatus,
        driverFeeCharge,
        driverDelayedPayment,
        externalContractChangedAt,
        price,
    } = order;

    const { showNoPaymentReceived, showPaymentReceived, showInvoiced, showAdditionalDocumentsAlert, showDriverPaymentFormAlert, requestsDocuments } =
        useOrderItem(order);

    const isDriver = useMeDriverRelated();
    const isMePartner = useIsPartnerCompany();
    const isMeAdmin = useMeAdmin();

    return (
        <Paper
            data-order-id={publicId}
            className={cn('', { flagged: order.isFlagged })}
            body={
                <div className={cn()}>
                    <div className={cn('left')}>
                        <div className={cn('top')}>
                            <OrderItemHeader
                                orderId={details.orderId}
                                orderPublicId={publicId}
                                inspectionType={details.inspectionType}
                                status={status}
                                paymentInformation={paymentInformation}
                                isFlagged={order.isFlagged}
                                shipperOrder={order.shipperOrder}
                                fundsTransferStatus={fundsTransferStatus}
                                instantTermPaymentType={instantTermPaymentType}
                                driverFeeCharge={driverFeeCharge}
                                driverDelayedPayment={driverDelayedPayment}
                                externalContractChangedAt={externalContractChangedAt}
                                driverOrderPrice={price}
                            />
                            {/* TODO hide temporarily by business decision */}
                            {/* {showDriverUshipperFeeAlert && (
                                <DriverUshipperFeeAlert driverFeeCharge={driverFeeCharge} driverFeeChargeConfirmed={driverFeeChargeConfirmed} />
                            )} */}
                            {showDriverPaymentFormAlert && <OrderDriverPaymentFormAlert order={order} headerSize='small' isFullDetailed={false} />}

                            {showAdditionalDocumentsAlert && (
                                <OrderAdditionalDocumentsAlert
                                    fundsTransferStatus={fundsTransferStatus}
                                    orderPublicId={publicId}
                                    requestsDocuments={requestsDocuments}
                                />
                            )}
                            {has(getOrderProducts(order)) &&
                                renderProjectSpecificComponent(
                                    {
                                        OrderItemVehiclesList: <OrderItemVehiclesList vehicles={order.vehicles} />,
                                        OrderItemCommoditiesList: <OrderItemCommoditiesList commodities={order.commodities} />,
                                    },
                                    'orderItemProductsList',
                                )}
                        </div>
                        <div className={cn('bottom')}>
                            <OrderItemInfo
                                fields={pickupInformation}
                                status={status}
                                pickedUpAt={pickedUpAt}
                                pickedUpAtTimezone={pickupInformation.timezone}
                                title={t('origin-title')}
                                emptyText={t('no-pickup-info')}
                            />
                            <OrderItemInfo
                                fields={deliveryInformation}
                                status={status}
                                deliveredAt={deliveredAt}
                                deliveredAtTimezone={deliveryInformation.timezone}
                                title={t('destination-title')}
                                emptyText={t('no-delivery-info')}
                            />
                            <OrderItemInfo fields={customerInformation} title={t('shipper-or-customer-title')} emptyText={t('no-client-info')} />
                        </div>
                    </div>
                    <div className={cn('right', { large: isMePartner })}>
                        {!isDriver && !isMeAdmin && <OrderActions order={order} context='orderItem' />}
                        <DriverDispatcherInfo driver={driver} dispatcher={dispatcher} />
                        {showNoPaymentReceived && <p className={cn('no-payment-received')}>{t('no-payment-received-text')}</p>}
                        {showInvoiced && sendInvoiceAt && (
                            <p className={cn('invoice')}>{t('invoiced-text', { date: format(new Date(sendInvoiceAt), 'd MMM yyyy, kk:mm') })}</p>
                        )}
                        {showPaymentReceived && paidAt && (
                            <p className={cn('payment-received')}>{t('payment-received-text', { date: format(new Date(paidAt), 'd MMM yyyy, kk:mm') })}</p>
                        )}
                        {latestInternalNote && (
                            <div className={cn('last-note')}>
                                <p>{t('last-note-title')}</p>
                                <p>{latestInternalNote.text}</p>
                            </div>
                        )}
                    </div>
                </div>
            }
        />
    );
};
