import React from 'react';
import { toKebabCase } from 'js-convert-case';

import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { Button } from '@/components/common/button/button';
import { Link } from '@/components/common/link/link';
import { InspectionType } from '@/enums/inspection-type';
import { OrderStatus } from '@/enums/order-status';
import { getOrderPriceWithTerms } from '@/utils/order';
import { useMeDriverRelated } from '@/hooks/use-user-role-group';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX } from '@utils/project-config';
import { translateOrderStatus, translateShipperCancelledOrderStatus } from '@utils/translate/order/get-order-status-translate';

import { DriverPayInfo } from './driver-pay-info/driver-pay-info';
import { DriverOrderPrice } from './driver-order-price';
import { useOrderItemHeader } from './hooks';
import { OrderItemHeaderProps } from './types';
import FlagIcon from '@/assets/icons/flag.svg';

const translateOrderItem = translateByNamespace('client:orders-page:order-item');
const cn = classname('order-item');

export const OrderItemHeader = ({
    orderId,
    inspectionType,
    status,
    paymentInformation,
    Tag,
    fundsTransferStatus,
    instantTermPaymentType,
    orderPublicId,
    isFlagged,
    shipperOrder,
    driverFeeCharge,
    driverDelayedPayment,
    externalContractChangedAt,
    driverOrderPrice,
}: OrderItemHeaderProps) => {
    const { totalAmount, delayedTerms, terms, isCarrier, handleUnFlaggedClick } = useOrderItemHeader({ paymentInformation, orderPublicId });
    const isDriver = useMeDriverRelated();

    return (
        <div className={cn('order-info')}>
            <Link
                href={{
                    pathname: '/client/orders/[order-id]',
                    query: { ['order-id']: orderPublicId },
                }}
                as={`/orders/${orderPublicId}`}
            >
                {/*{TODO STYLE LINK AND REMOVE BUTTON }*/}
                <Button size='small'>
                    {translateOrderItem('order-id-label')}: {orderId ?? 'None'}
                </Button>
            </Link>

            {!isFreightX && inspectionType === InspectionType.ADVANCED && (
                <OrderTag view='advanced'>{translateOrderItem('advanced-inspection-type-label')}</OrderTag>
            )}
            {Tag || <OrderTag view={toKebabCase(status)}>{translateOrderStatus(status)}</OrderTag>}
            {isCarrier && shipperOrder?.status === OrderStatus.CANCELED && (
                <OrderTag view={toKebabCase(shipperOrder.status)}>{translateShipperCancelledOrderStatus()}</OrderTag>
            )}
            {isCarrier && externalContractChangedAt && <OrderTag view='source-danger'>{translateOrderItem('changed-by-broker')}</OrderTag>}
            {!isDriver && (
                <>
                    {totalAmount > 0 && (terms || delayedTerms) && <p className={cn('price')}>{getOrderPriceWithTerms(totalAmount, [terms, delayedTerms])}</p>}
                    <DriverPayInfo
                        status={status}
                        fundsTransferStatus={fundsTransferStatus}
                        driverFeeCharge={driverFeeCharge}
                        driverDelayedPayment={driverDelayedPayment}
                        paymentInformation={paymentInformation}
                        instantTermPaymentType={instantTermPaymentType}
                    />
                </>
            )}
            {isDriver && (
                <DriverOrderPrice
                    paymentInformation={paymentInformation}
                    driverDelayedPayment={driverDelayedPayment}
                    orderPrice={driverOrderPrice}
                    instantTermPaymentType={instantTermPaymentType}
                />
            )}
            {isFlagged && (
                <div className={cn('flag-wrapper', { flagged: isFlagged })} onClick={handleUnFlaggedClick}>
                    <FlagIcon />
                </div>
            )}
        </div>
    );
};
