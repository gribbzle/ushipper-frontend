import { PaymentTerm } from '@/enums/payment-term';
import { AppState } from "@store";

const EMPTY_ARRAY: any[] = [];

const paymentTermsStateSelector = (state: AppState) => state.common.paymentTerms;

export const fetchedPaymentTermsSelector = (state: AppState) => {
    const { paymentTerms } = paymentTermsStateSelector(state);

    return paymentTerms;
};

export const paymentMethodsSelector = (paymentTermId: PaymentTerm) => (state: AppState) => {
    const { paymentTerms } = paymentTermsStateSelector(state);

    return paymentTerms.find(paymentTerm => paymentTerm.id === paymentTermId)?.methods ?? EMPTY_ARRAY;
};
