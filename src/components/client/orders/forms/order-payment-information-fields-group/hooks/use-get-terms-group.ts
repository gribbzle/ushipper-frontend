import { useMemo } from 'react';

import { DelayedPaymentTerm, InstantPaymentTerm, PaymentTerm } from '@/enums';

import { useGetPaymentInformationValues } from './use-get-payment-information-values';
import { useTermsFieldSelected } from './use-terms-field-selected';

export const useGetTermsGroup = () => {
    const { isSelectedInstantTermInDelayedField, isSelectedDelayedTermInDelayedField, isSelectedDelayedTermInInstantField } = useTermsFieldSelected();
    const { terms } = useGetPaymentInformationValues();

    const termsGroup = useMemo(() => {
        if (isSelectedInstantTermInDelayedField) {
            return DelayedPaymentTerm;
        }
        if (isSelectedDelayedTermInDelayedField) {
            return InstantPaymentTerm;
        }

        return PaymentTerm;
    }, [isSelectedInstantTermInDelayedField, isSelectedDelayedTermInDelayedField]);

    const delayedTermsGroup = useMemo(() => {
        if (isSelectedDelayedTermInInstantField) {
            return InstantPaymentTerm;
        }
        if (terms) {
            return DelayedPaymentTerm;
        }

        return PaymentTerm;
    }, [isSelectedDelayedTermInInstantField, terms]);

    return { termsGroup, delayedTermsGroup };
};
