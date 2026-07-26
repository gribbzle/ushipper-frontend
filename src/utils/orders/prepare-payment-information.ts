import { PaymentTerm } from '@/enums';
import { OrderPaymentInformation } from '@store/client';

import { isDelayedTermPaymentMethod, isInstantTermPaymentMethod } from './is-payment-method-type';

const shouldSwap = ({ delayedTerms, terms }: { delayedTerms?: PaymentTerm | null; terms?: PaymentTerm | null }) =>
    delayedTerms === PaymentTerm.COD || delayedTerms === PaymentTerm.COP || (terms && terms !== PaymentTerm.COD && terms !== PaymentTerm.COP);

export const preparePaymentInformation = (paymentInformation: Partial<OrderPaymentInformation>): Partial<OrderPaymentInformation> => {
    const { delayedMethod, delayedPayment, delayedTerms, terms, payment, method, ...rest } = paymentInformation;

    if (shouldSwap({ delayedTerms, terms })) {
        return {
            ...rest,
            delayedTerms: terms ?? null,
            delayedMethod: terms && isDelayedTermPaymentMethod(method) ? method : null,
            delayedPayment: payment ?? null,
            terms: delayedTerms ?? null,
            payment: delayedPayment ?? null,
            method: delayedTerms && isInstantTermPaymentMethod(delayedMethod) ? delayedMethod : null,
        };
    }

    return {
        ...rest,
        delayedTerms: delayedTerms ?? null,
        delayedMethod: delayedTerms && isDelayedTermPaymentMethod(delayedMethod) ? delayedMethod : null,
        delayedPayment: delayedPayment ?? null,
        terms: terms ?? null,
        payment: payment ?? null,
        method: terms && isInstantTermPaymentMethod(method) ? method : null,
    };
};
