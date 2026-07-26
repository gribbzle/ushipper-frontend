import { useMemo } from 'react';

import { OrderSourcesEnum, PaymentTerm } from '@/enums';
import { getOrderTermWithMethod } from '@/utils/order';
import { calculateTotalPayment, getPaymentTermTranslate, getShortPaymentTermTranslate } from '@/utils/payment';
import { useMeDriverRelated } from '@hooks';
import { Load } from '@store/client';
import { formatToCurrency } from '@utils';

export const usePaymentInfo = (order: Load, view?: 'small') => {
    const isDriver = useMeDriverRelated();

    const { paymentInformation, drivingDistance, driverFeeCharge, driverDelayedPayment, source, vehicles, commodities } = order;
    const { terms, method, delayedMethod, payment, delayedPayment, delayedTerms } = paymentInformation;

    const totalAmount = useMemo(() => {
        if (isDriver) {
            if (driverDelayedPayment && !driverFeeCharge) {
                return driverDelayedPayment.formatted;
            }

            if (driverDelayedPayment && driverFeeCharge) {
                return formatToCurrency(parseInt(driverDelayedPayment.amount) / 100 + (paymentInformation.payment ?? 0));
            }
        }

        return formatToCurrency(calculateTotalPayment(paymentInformation));
    }, [isDriver, paymentInformation, driverDelayedPayment, driverFeeCharge]);

    const termsAndMethods = useMemo(() => {
        if (source !== OrderSourcesEnum.USHIPPER && !view) {
            const termsAndMethodsArray = [
                terms && method ? getOrderTermWithMethod(terms, method) : null,
                delayedPayment && delayedTerms && delayedMethod ? getOrderTermWithMethod(delayedTerms, delayedMethod) : null,
            ];

            return termsAndMethodsArray.filter(Boolean);
        }

        return [
            [terms, delayedPayment && delayedTerms]
                .filter(Boolean)
                .map(term => (view === 'small' ? getShortPaymentTermTranslate(term as PaymentTerm) : getPaymentTermTranslate(term as PaymentTerm)))
                .join(', '),
        ];
    }, [delayedMethod, delayedPayment, delayedTerms, method, source, terms, view]);

    return { paymentInformation, vehicles, commodities, totalAmount, terms, payment, delayedPayment, delayedTerms, drivingDistance, termsAndMethods };
};
