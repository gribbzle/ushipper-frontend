import { useEffect, useRef } from 'react';
import { useForm } from 'react-final-form';

import { OrderFieldsGroup } from '@store/client';

import { useGetPaymentInformationValues } from './use-get-payment-information-values';

export const useCarrierPaymentInfoFields = () => {
    const { terms } = useGetPaymentInformationValues();
    const termsOptionsRef = useRef<any>(terms);
    const { batch, change } = useForm();

    useEffect(() => {
        if (!termsOptionsRef.current) {
            termsOptionsRef.current = terms;

            return;
        }

        if (termsOptionsRef.current !== terms) {
            batch(() => {
                change(`${OrderFieldsGroup.PAYMENT_INFORMATION}.method`, null);
            });

            termsOptionsRef.current = terms;
        }
    }, [terms, batch, change]);

    return {};
};
