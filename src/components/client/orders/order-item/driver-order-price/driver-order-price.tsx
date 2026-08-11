import React, { useMemo } from 'react';

import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { useOrderPaymentTerms } from '@/hooks/order/use-order-payment-terms';
import { getPaymentTermTranslate } from '@/utils/payment';
import { BalanceValue } from '@store/admin';
import { OrderPaymentInformation } from '@store/client';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { preparePaymentInformation } from '@utils/orders/prepare-payment-information';
import { getProjectOrderPayText } from '@utils/translate/order/get-project-order-pay-text';

import './driver-order-price.scss';

const tCheckApproval = translateByNamespace('common:order');
const cn = classname('driver-order-price');

export type DriverOrderPriceProps = {
    orderPrice?: number | null;
    driverDelayedPayment?: BalanceValue | null;
    paymentInformation: OrderPaymentInformation;
    instantTermPaymentType?: InstantTermPaymentType | null;
};

export const DriverOrderPrice = ({ orderPrice, paymentInformation, driverDelayedPayment, instantTermPaymentType }: DriverOrderPriceProps) => {
    const preparedPaymentInformation = useMemo(() => (paymentInformation ? preparePaymentInformation(paymentInformation) : null), [paymentInformation]);
    const projectOrderPayText = getProjectOrderPayText();

    const { payment, terms, delayedTerms } = preparedPaymentInformation || {};
    const { isBothTermsOrder, isOnlyInstantTermsOrder } = useOrderPaymentTerms({ terms, delayedTerms });

    if (isBothTermsOrder) {
        const totalAmount = (payment ?? 0) + Number(driverDelayedPayment?.amount ?? 0) / 100;

        return (
            <p className={cn('')}>
                {formatToCurrency(totalAmount)} {`(${terms && getPaymentTermTranslate(terms)}, ${projectOrderPayText})`}
            </p>
        );
    }

    if (isOnlyInstantTermsOrder) {
        return (
            <p className={cn('')}>
                {formatToCurrency(payment ?? 0)} {terms && `(${getPaymentTermTranslate(terms)})`}{' '}
                {instantTermPaymentType === InstantTermPaymentType.RECIPIENT_COMPANY && tCheckApproval('order-check-approval-status')}
            </p>
        );
    }

    return orderPrice ? (
        <p className={cn('')}>
            {formatToCurrency(orderPrice / 100)} {`(${projectOrderPayText})`}
        </p>
    ) : null;
};
