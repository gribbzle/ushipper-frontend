import React, { useMemo } from 'react';

import { MileCostTooltip } from '@/components/common/mile-cost-tooltip/mile-cost-tooltip';
import { getPaymentTermsTranslate } from '@/utils/order';
import { calculateTotalPayment } from '@/utils/payment';
import { useAppSelector } from '@store';
import { orderCommoditiesSelector, orderDrivingDistanceSelector, orderPaymentInformationSelector, orderVehiclesSelector } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import { OrderInfoDetailsWrapper } from '../order-info-details-wrapper';

import './order-price-info.scss';

const t = translateByNamespace('client:order:order-information');
const cn = classname('order-price-info');

export const OrderPriceInfo = () => {
    const paymentInformation = useAppSelector(orderPaymentInformationSelector);
    const drivingDistance = useAppSelector(orderDrivingDistanceSelector);
    const vehicles = useAppSelector(orderVehiclesSelector);
    const commodities = useAppSelector(orderCommoditiesSelector);

    const { terms, delayedTerms } = paymentInformation || {};

    const totalPrice = useMemo(() => (paymentInformation ? calculateTotalPayment(paymentInformation) : 0), [paymentInformation]);

    return (
        <OrderInfoDetailsWrapper title={t('order-price-title')}>
            <div className={cn()}>
                <span className={cn('price')}>
                    {totalPrice > 0
                        ? `${formatToCurrency(totalPrice)} ${terms || delayedTerms ? `(${getPaymentTermsTranslate([terms, delayedTerms])})` : ''}`
                        : t('no-price')}
                </span>
                {totalPrice > 0 && paymentInformation && (
                    <MileCostTooltip
                        drivingDistance={drivingDistance}
                        paymentInformation={paymentInformation}
                        vehicles={vehicles}
                        commodities={commodities}
                        classNameTitle={cn('distance')}
                    />
                )}
            </div>
        </OrderInfoDetailsWrapper>
    );
};
