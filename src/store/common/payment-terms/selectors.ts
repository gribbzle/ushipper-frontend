import { PaymentTerm } from '@/enums';
import { AppState } from '@store';

const paymentTermsStateSelector = (state: AppState) => state.common.paymentTerms;

export const fetchedPaymentTermsSelector = (state: AppState) => {
    const { paymentTerms } = paymentTermsStateSelector(state);

    return paymentTerms;
};

export const paymentMethodsSelector = (paymentTermId: PaymentTerm) => (state: AppState) => {
    const { paymentTerms } = paymentTermsStateSelector(state);

    return paymentTerms.find(paymentTerm => paymentTerm.id === paymentTermId)?.methods ?? [];
};
