import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { cashOutTransactionPopupPropsSelector, walletActions } from '@store/client';

import { CashOutTransactionFormState } from './cash-out-transaction-form/cash-out-transaction-form.types';

export const useCashOutTransactionPopup = () => {
    const { isPopupOpened } = useAppSelector(cashOutTransactionPopupPropsSelector);
    const formRef = useRef<FormApi<CashOutTransactionFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const closeCashOutTransactionPopup = useCallback(() => {
        dispatch(walletActions.setCashOutTransactionPopupProps({ isPopupOpened: false }));
    }, [dispatch]);

    return {
        formRef,
        isPopupOpened,
        handleSubmitClick,
        closeCashOutTransactionPopup,
    };
};
