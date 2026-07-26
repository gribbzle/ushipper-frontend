import { useCallback } from 'react';
import { useForm } from 'react-final-form';

import { OrderFieldsGroup } from '@store/client';

export const useHandleDelayedFieldsDelete = (onAfterDelayedFieldsDelete: () => void) => {
    const { batch, change } = useForm();

    const handleDelayedFieldsDelete = useCallback(() => {
        batch(() => {
            change(`${OrderFieldsGroup.PAYMENT_INFORMATION}.delayedPayment`, null);
            change(`${OrderFieldsGroup.PAYMENT_INFORMATION}.delayedTerms`, null);
            change(`${OrderFieldsGroup.PAYMENT_INFORMATION}.delayedMethod`, null);
        });

        onAfterDelayedFieldsDelete();
    }, [onAfterDelayedFieldsDelete, batch, change]);

    return { handleDelayedFieldsDelete };
};
