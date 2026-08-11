import { useMemo } from 'react';

import { usePaymentTerm } from '@/hooks/order/use-order-payment-terms';

import { useGetPaymentInformationValues } from './use-get-payment-information-values';

export const useTermsFieldSelected = () => {
    const { terms, delayedTerms } = useGetPaymentInformationValues();
    const { isDelayed, isInstant } = usePaymentTerm();

    const isSelectedInstantTermInInstantField = useMemo(() => !!terms && isInstant(terms), [terms, isInstant]);
    const isSelectedDelayedTermInInstantField = useMemo(() => !!terms && isDelayed(terms), [terms, isDelayed]);
    const isSelectedInstantTermInDelayedField = useMemo(() => !!delayedTerms && isInstant(delayedTerms), [delayedTerms, isInstant]);
    const isSelectedDelayedTermInDelayedField = useMemo(() => !!delayedTerms && isDelayed(delayedTerms), [delayedTerms, isDelayed]);

    return {
        isSelectedInstantTermInInstantField,
        isSelectedDelayedTermInInstantField,
        isSelectedInstantTermInDelayedField,
        isSelectedDelayedTermInDelayedField,
    };
};
