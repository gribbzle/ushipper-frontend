import React, { useMemo } from 'react';

import { useOrder } from '@/hooks/order/useOrder';
import { useOrderPaymentTerms } from '@/hooks/order/use-order-payment-terms';
import { getOrderTermWithMethod } from '@/utils/order';
import { calculateTotalPayment, getPaymentMethodTranslate, getPaymentTermTranslate } from '@/utils/payment';
import { classname } from '@utils/classname';
import { formatToCurrency } from '@utils/numbers';
import { preparePaymentInformation } from '@utils/orders/prepare-payment-information';

import './order-price-info.scss';

const cn = classname('price-info');

type PriceInfoProps = {
    showInstantPaymentMethod?: boolean;
    className?: string;
};

export const OrderPriceInfo = ({ showInstantPaymentMethod = false, className }: PriceInfoProps) => {
    const { paymentInformation, instantTermPaymentMethod } = useOrder();

    const totalAmount = calculateTotalPayment(paymentInformation);
    const { terms, delayedTerms, method } = preparePaymentInformation(paymentInformation);
    const { isBothTermsOrder, isOnlyInstantTermsOrder, isOnlyDelayedTermsOrder } = useOrderPaymentTerms({ terms, delayedTerms });

    const termsText = useMemo(
        () =>
            [terms, delayedTerms]
                .filter(Boolean)
                .map(term => getPaymentTermTranslate(term!))
                .join(' / '),
        [delayedTerms, terms],
    );

    const paymentContent = useMemo(() => {
        const instantTermsAndMethod = terms && method ? getOrderTermWithMethod(terms, method) : null;
        const delayedTermsText = delayedTerms ? getPaymentTermTranslate(delayedTerms) : undefined;

        switch (true) {
            case !termsText:
                return null;

            case isOnlyDelayedTermsOrder:
                return termsText;

            case isOnlyInstantTermsOrder:
                return instantTermsAndMethod;

            case isBothTermsOrder:
                return [instantTermsAndMethod, delayedTermsText].filter(Boolean).join(', ');

            default:
                return null;
        }
    }, [isOnlyDelayedTermsOrder, isOnlyInstantTermsOrder, isBothTermsOrder, termsText, terms, method, delayedTerms]);

    const driverPaymentContent = useMemo(() => {
        if (!termsText) {
            return null;
        }

        const methodText = instantTermPaymentMethod ? `, ${getPaymentMethodTranslate(instantTermPaymentMethod)}` : '';

        return `${termsText}${methodText}`;
    }, [termsText, instantTermPaymentMethod]);

    if (!totalAmount) {
        return <>—</>;
    }

    return (
        <div className={cn('', [className])}>
            <h4 className={cn('text')}>
                <span>{!!totalAmount && formatToCurrency(totalAmount)}</span>{' '}
            </h4>
            <p className={cn('sub-text')}>{showInstantPaymentMethod ? driverPaymentContent : paymentContent}</p>
        </div>
    );
};
