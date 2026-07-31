import React, { useCallback, useMemo } from 'react';
import has from 'has-values';

import { ShipperOrderActions } from '@/components/client/orders/order-actions/shipper-order-actions';
import { OrderItemInfo } from '@/components/client/orders/order-item/info';
import { OrderItemHeader } from '@/components/client/orders/order-item/order-item-header';
import { OrderItemProps } from '@/components/client/orders/order-item/types';
import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { OrderItemVehiclesList } from '@/components/client/orders/order-item-vehicles-list';
import { Paper } from '@/components/ui/surfaces/paper/paper';
import { OrderStatus } from '@/enums';
import { getOrderPriceWithTerms } from '@/utils/order';
import { calculateTotalPayment, getPaymentTermTranslate } from '@/utils/payment';
import { OrderPaymentInformation } from '@store/client';
import { classname } from '@utils/classname';
import { diffForHumans } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { getOrderProducts } from '@utils/orders/get-order-products';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

import { OrderItemCommoditiesList } from '../order-item-commodities-list';

import './order-item.scss';

const translateOrderItem = translateByNamespace('client:orders-page:order-item');
const cn = classname('order-item');
const shipperCn = classname('shipper-order-item');

export const ShipperOrderItem = ({ order }: OrderItemProps) => {
    const {
        publicId,
        details,
        customerInformation,
        deliveryInformation,
        paymentInformation,
        pickupInformation,
        vehicles,
        commodities,
        latestInternalNote,
        status,
        pickedUpAt,
        deliveredAt,
        latestOffer,
        isFlagged,
    } = order;

    const handleShowCompanyPage = useCallback(() => {
        const publicId = latestOffer?.carrierCompany.publicId;
        const aliasPath = `/companies/${publicId}`;

        if (publicId) {
            window.open(aliasPath, '_blank');
        }
    }, [latestOffer?.carrierCompany.publicId]);

    const paymentInfo = useMemo(() => {
        const paymentInformation = order.paymentInformation as unknown as OrderPaymentInformation;
        const { clientPrice, payment, clientTerms, terms, delayedPayment, delayedTerms } = paymentInformation;

        const totalAmount = calculateTotalPayment(paymentInformation);

        let grossFee = null;

        if (clientPrice && (payment || delayedPayment)) {
            grossFee = clientPrice - totalAmount;
        }

        return {
            clientPrice:
                clientPrice && clientTerms
                    ? `${translateOrderItem('client-price')}: ${formatToCurrency(clientPrice)} (${getPaymentTermTranslate(clientTerms)})`
                    : '',
            carrierPayment:
                totalAmount > 0 && (terms || delayedTerms)
                    ? `${translateOrderItem('carrier-price')}: ${getOrderPriceWithTerms(totalAmount, [terms, delayedTerms])}`
                    : '',
            grossFee: grossFee ? `${translateOrderItem('gross-fee')}: ${formatToCurrency(grossFee)}` : '',
        };
    }, [order]);

    return (
        <Paper
            data-order-id={publicId}
            className={cn('', { flagged: isFlagged })}
            body={
                <div className={`${cn()} ${shipperCn()}`}>
                    <div className={shipperCn('shipper-header-vehicles')}>
                        <OrderItemHeader
                            orderPublicId={publicId}
                            orderId={details.orderId}
                            inspectionType={details.inspectionType}
                            status={status}
                            paymentInformation={paymentInformation}
                            isFlagged={isFlagged}
                        />
                        {has(getOrderProducts(order)) &&
                            renderProjectSpecificComponent(
                                {
                                    OrderItemVehiclesList: <OrderItemVehiclesList vehicles={vehicles} />,
                                    OrderItemCommoditiesList: <OrderItemCommoditiesList commodities={commodities} />,
                                },
                                'orderItemProductsList',
                            )}
                    </div>
                    <div className={shipperCn('shipper-header-actions')}>
                        <ShipperOrderActions order={order} isOrderItemContext={true} />
                        <div className={shipperCn('meta')}>
                            {latestInternalNote && (
                                <div className={cn('last-note')}>
                                    <p className={cn('last-note-bold')}>{translateOrderItem('last-note-title')}</p>
                                    <p>{latestInternalNote.text}</p>
                                </div>
                            )}
                        </div>
                        {status === OrderStatus.PENDING && latestOffer && (
                            <div className={shipperCn('meta')}>
                                <div className={cn('offer-meta')}>
                                    <p>
                                        {translateOrderItem('offer-meta')}
                                        <span className={cn('last-note-bold', [cn('link')])} onClick={handleShowCompanyPage}>
                                            {latestOffer.carrierCompany.name}
                                        </span>
                                        {diffForHumans(new Date(latestOffer.createdAt))}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={shipperCn('shipper-columns-wrapper')}>
                        <OrderItemInfo
                            fields={pickupInformation}
                            status={status}
                            pickedUpAt={pickedUpAt}
                            pickedUpAtTimezone={pickupInformation.timezone}
                            title={translateOrderItem('origin-title')}
                            emptyText={translateOrderItem('no-pickup-info')}
                        />
                        <OrderItemInfo
                            fields={deliveryInformation}
                            status={status}
                            deliveredAt={deliveredAt}
                            pickedUpAtTimezone={deliveryInformation.timezone}
                            title={translateOrderItem('destination-title')}
                            emptyText={translateOrderItem('no-delivery-info')}
                        />
                        <OrderItemInfo fields={customerInformation} title={translateOrderItem('client')} emptyText={translateOrderItem('no-client-info')} />
                    </div>
                    <OrderItemInfoColumn
                        infoObject={paymentInfo}
                        title={translateOrderItem('payment-title')}
                        noDataText={translateOrderItem('no-payment-received-text')}
                        className={shipperCn('shipper-price-col')}
                    />
                </div>
            }
        />
    );
};
