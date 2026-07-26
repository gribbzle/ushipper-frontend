import { useFormState } from 'react-final-form';

import { OrderFieldsGroup } from '@store/client';

export const useGetPaymentValues = () => {
    const formState = useFormState();
    const paymentValues = formState.values?.[OrderFieldsGroup.PAYMENT];

    return { paymentValues };
};
