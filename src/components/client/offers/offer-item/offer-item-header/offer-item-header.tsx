import React, { useCallback, useMemo } from 'react';
import { toKebabCase } from 'js-convert-case';
import { useRouter } from 'next/router';

import { OfferTabsEnum } from '@/components/client/offers/offer-drawer/offer-drawer';
import { getOrderId, getPaymentTermsTranslate } from '@/utils/order';
import { getFinalPaymentAmount, getPaymentPerDistance } from '@/utils/payment';
import { Button, OrderTag } from '@components';
import { useMeCarrier } from '@hooks';
import { OrderOffer } from '@store/api/order-offers';
import { classname, formatToCurrency, translateByNamespace } from '@utils';

import './offer-item-header.scss';

const t = translateByNamespace('client:order-offers');
const cn = classname('offer-item-header');

type Props = {
    offer: OrderOffer;
};

export const OfferItemHeader = ({ offer }: Props) => {
    const isMeCarrier = useMeCarrier();
    const { push, pathname, asPath } = useRouter();

    const { paymentPrice, delayedPayment, brokerFee, status, order, delayedTerms, paymentTerms } = offer;
    const { drivingDistance } = order;

    const handleShowOrderClick = useCallback(async () => {
        await push(
            {
                pathname,
                query: {
                    drawerOfferId: offer.publicId,
                    drawerTab: OfferTabsEnum.details,
                },
            },
            {
                pathname: asPath,
                query: {
                    drawerOfferId: offer.publicId,
                    drawerTab: OfferTabsEnum.details,
                },
            },
        );
    }, [offer.publicId, push, pathname, asPath]);

    const totalPrice = useMemo(() => getFinalPaymentAmount(paymentPrice, delayedPayment, brokerFee), [paymentPrice, delayedPayment, brokerFee]);

    return (
        <div className={cn()}>
            <Button size='small' onClick={handleShowOrderClick}>
                {t('item:order-id', { orderId: getOrderId(order) })}
            </Button>
            <OrderTag view={toKebabCase(status)}>{isMeCarrier ? t(`status:${status}`) : t(`status:shipper-${status}`)}</OrderTag>
            {totalPrice > 0 && (
                <span className={cn('payment')}>
                    {formatToCurrency(totalPrice)} {(paymentTerms || delayedTerms) && <> ({getPaymentTermsTranslate([paymentTerms, delayedTerms])})</>}
                </span>
            )}

            {!!totalPrice && !!drivingDistance && <span className={cn('distance')}>{getPaymentPerDistance(totalPrice, drivingDistance)}</span>}
        </div>
    );
};
