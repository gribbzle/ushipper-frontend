import { useFormState } from 'react-final-form';

import { OrderFieldsGroup } from '@store/client';

export const useGetPaymentInformationValues = () => {
    const formState = useFormState();
    const paymentInformation = formState.values?.[OrderFieldsGroup.PAYMENT_INFORMATION];
    const { payment, brokerFee, terms, delayedTerms, delayedPayment } = paymentInformation || {};

    return { formState, payment, brokerFee, terms, delayedTerms, delayedPayment };
};
