import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, initiateAccountPaymentMethodsPopupPropsSelector } from '@store/admin';

import { InitiateAccountPaymentMethodsFormState } from './initiate-account-payment-methods-form';

export const useInitiateAccountPaymentMethodsPopup = () => {
    const { isPopupOpened, data: initiatePaymentMethodInfo } = useAppSelector(initiateAccountPaymentMethodsPopupPropsSelector);
    const formRef = useRef<FormApi<InitiateAccountPaymentMethodsFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const closeInitiateAccountPaymentMethodsPopup = useCallback(() => {
        dispatch(
            accountingActions.setInitiateAccountPaymentMethodsPopupProps({
                isPopupOpened: false,
                accountPublicId: null,
                data: null,
                balanceId: null,
            }),
        );
    }, [dispatch]);

    return {
        formRef,
        isPopupOpened,
        initiatePaymentMethodInfo,
        handleSubmitClick,
        closeInitiateAccountPaymentMethodsPopup,
    };
};
