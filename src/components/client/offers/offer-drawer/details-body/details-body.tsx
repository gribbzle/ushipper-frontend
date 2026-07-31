import React, { ReactElement, useCallback, useMemo } from 'react';
import has from 'has-values';
import { toKebabCase } from 'js-convert-case';

import { OfferVehicles } from '@/components/client/offers/offer-vehicles/offer-vehicles';
import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column';
import { OrderRoute } from '@/components/client/orders/order-route/order-route';
import { OrderTag } from '@/components/client/orders/order-tag/order-tag';
import { CompanyRatingWithReviewCount } from '@/components/common/company-rating-with-review-count/company-rating-with-review-count';
import { useMeCarrier, useMeShipper } from '@/hooks/use-user-role-group';
import { getDestination } from '@/utils/driving';
import { getOrderId, getPaymentTermsTranslate } from '@/utils/order';
import { getFinalPaymentAmount, getPaymentPerDistance } from '@/utils/payment';
import { UserIcon } from '@icons';
import { OrderOffer } from '@store/api/order-offers';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { numWords } from '@utils/num-words';
import { formatToCurrency } from '@utils/numbers';
import { getObjectWithoutEmptyFields } from '@utils/objects';
import { getOrderProducts } from '@utils/orders/get-order-products';
import { renderProjectSpecificComponent } from '@utils/render-project-specific-component';

import { OfferCommodities } from '../../offer-commodities';

const t = translateByNamespace('client:order-offers');
const cn = classname('offer-drawer');

type Props = {
    offer: OrderOffer;
};

const infoKeysRenderers: { [key: string]: (value: string) => ReactElement } = {
    email: (value: string) => <a href={`mailto:${value}`}>{value}</a>,
    phone: (value: string) => <a href={`tel:${value}`}>{value}</a>,
};

export default function DetailsBody({ offer }: Props) {
    const { order, paymentPrice, brokerFee, delayedPayment, paymentTerms, delayedTerms, carrierCompany, shipperCompany } = offer;
    const { vehicles, drivingDistance, pickupInformation, commodities, deliveryInformation } = order;

    const carrierInfo = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                name: carrierCompany.owner.name,
                phone: carrierCompany.phone,
                email: carrierCompany.email,
            }),
        [carrierCompany.email, carrierCompany.owner.name, carrierCompany.phone],
    );

    const shipperInfo = useMemo(
        () =>
            getObjectWithoutEmptyFields({
                name: shipperCompany.owner.name,
                phone: shipperCompany.phone,
                email: shipperCompany.email,
            }),
        [shipperCompany.email, shipperCompany.owner.name, shipperCompany.phone],
    );
    const renderInfo = (entry: [string, string]) => {
        const key = entry[0];
        const value = entry[1];

        return <div className={cn('value')}>{infoKeysRenderers[key] ? infoKeysRenderers[key](value) : value}</div>;
    };
    const isCarrier = useMeCarrier();
    const isShipper = useMeShipper();

    const handleShowCompanyPage = useCallback(() => {
        const aliasPath = `/companies/${carrierCompany.publicId}`;

        window.open(aliasPath, '_blank');
    }, [carrierCompany.publicId]);

    const totalPayment = useMemo(() => getFinalPaymentAmount(paymentPrice, delayedPayment, brokerFee), [paymentPrice, brokerFee, delayedPayment]);

    return (
        <div className={cn()}>
            <div className={cn('row')}>
                <div>
                    <span className={cn('title')}>{t('drawer:status')}</span>
                    <OrderTag view={toKebabCase(offer.status)}>{isCarrier ? t(`status:${offer.status}`) : t(`status:shipper-${offer.status}`)}</OrderTag>
                </div>
                <div>
                    <span className={cn('title')}>{t('drawer:order-id')}</span>
                    <span className={cn('order')}>{getOrderId(order)}</span>
                </div>
            </div>
            <OrderItemInfoColumn title={t('drawer:route')}>
                <OrderRoute inline={true} pickupInformation={pickupInformation} deliveryInformation={deliveryInformation} />
                {drivingDistance && <p className={cn('distance')}>{getDestination(drivingDistance)}</p>}
            </OrderItemInfoColumn>
            {has(getOrderProducts(order)) &&
                renderProjectSpecificComponent(
                    {
                        OfferVehiclesDetailsDrawerBody: (
                            <OrderItemInfoColumn title={`${vehicles.length} ${numWords(vehicles.length, [t('drawer:vehicle'), t('drawer:vehicles')])}`}>
                                <OfferVehicles vehicles={vehicles} />
                            </OrderItemInfoColumn>
                        ),
                        OfferCommoditiesDetailsDrawerBody: (
                            <OrderItemInfoColumn
                                title={`${commodities.length} ${numWords(commodities.length, [t('drawer:commodity'), t('drawer:commodities')])}`}
                            >
                                <OfferCommodities commodities={commodities} />
                            </OrderItemInfoColumn>
                        ),
                    },
                    'offerProductsDetailsDrawerBody',
                )}
            {totalPayment > 0 && (
                <OrderItemInfoColumn title={t('drawer:payment')}>
                    <div className={cn('payment-container')}>
                        <span className={cn('payment')}>
                            {formatToCurrency(totalPayment)} {(paymentTerms || delayedTerms) && `(${getPaymentTermsTranslate([paymentTerms, delayedTerms])})`}
                        </span>
                        {drivingDistance && <span className={cn('price-distance')}>{getPaymentPerDistance(totalPayment, drivingDistance)}</span>}
                    </div>
                </OrderItemInfoColumn>
            )}
            {isShipper && (
                <OrderItemInfoColumn title={t('drawer:carrier')}>
                    {carrierCompany.name && (
                        <>
                            <span onClick={handleShowCompanyPage} className={cn('to-carrier')}>
                                {carrierCompany.name}
                            </span>
                            <CompanyRatingWithReviewCount rating={carrierCompany?.rating} reviewsTotal={carrierCompany?.reviewsTotal} />
                        </>
                    )}
                    {has(carrierInfo) && (
                        <div className={cn('carrier-info')}>
                            <UserIcon />
                            <div>{Object.entries(carrierInfo).map(renderInfo)}</div>
                        </div>
                    )}
                </OrderItemInfoColumn>
            )}
            {isCarrier && (
                <OrderItemInfoColumn title={t('drawer:shipper')}>
                    {shipperCompany.name && (
                        <>
                            <span onClick={handleShowCompanyPage} className={cn('to-carrier')}>
                                {shipperCompany.name}
                            </span>
                            <CompanyRatingWithReviewCount rating={shipperCompany.rating} reviewsTotal={shipperCompany.reviewsTotal} />
                        </>
                    )}
                    {has(shipperCompany) && (
                        <div className={cn('carrier-info')}>
                            <UserIcon />
                            <div>{Object.entries(shipperInfo).map(renderInfo)}</div>
                        </div>
                    )}
                </OrderItemInfoColumn>
            )}
        </div>
    );
}
