import { useMemo } from 'react';

import { DELAYED_TERMS, INSTANT_TERMS, PaymentTerm } from '@/enums';

export const usePaymentTerm = () => {
    const isDelayed = (term: PaymentTerm) => DELAYED_TERMS.includes(term);
    const isInstant = (term: PaymentTerm) => INSTANT_TERMS.includes(term);

    return {
        isDelayed,
        isInstant,
    };
};

type Props = {
    terms?: PaymentTerm | null;
    delayedTerms?: PaymentTerm | null;
};

//TODO deprecated, use useOrderPaymentInformationHelpers instead
export const useOrderPaymentTerms = ({ terms, delayedTerms }: Props) => {
    const { isDelayed, isInstant } = usePaymentTerm();

    const isInstantTermsOrder = useMemo(() => {
        const isTermsInstant = !!terms && isInstant(terms);
        const isDelayedTermsInstant = !!delayedTerms && isInstant(delayedTerms);

        return isTermsInstant || isDelayedTermsInstant;
    }, [terms, delayedTerms, isInstant]);

    const isDelayedTermsOrder = useMemo(() => {
        const isTermsDelayed = !!terms && isDelayed(terms);
        const isDelayedTermsDelayed = !!delayedTerms && isDelayed(delayedTerms);

        return isTermsDelayed || isDelayedTermsDelayed;
    }, [terms, delayedTerms, isDelayed]);

    const isBothTermsOrder = isInstantTermsOrder && isDelayedTermsOrder;
    const isOnlyInstantTermsOrder = !isBothTermsOrder && isInstantTermsOrder;
    const isOnlyDelayedTermsOrder = !isBothTermsOrder && isDelayedTermsOrder;

    return {
        isOnlyInstantTermsOrder,
        isOnlyDelayedTermsOrder,
        isInstantTermsOrder,
        isDelayedTermsOrder,
        isBothTermsOrder,
    };
};
