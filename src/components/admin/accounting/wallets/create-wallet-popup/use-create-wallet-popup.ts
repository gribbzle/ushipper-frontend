import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, createWalletPopupPropsSelector } from '@store/admin';

import { CreateWalletFormState } from './create-wallet-form/create-wallet-form.types';

export const useWalletPopup = () => {
    const { isPopupOpened } = useAppSelector(createWalletPopupPropsSelector);
    const formRef = useRef<FormApi<CreateWalletFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const closeCreateWalletPopup = useCallback(
        () => dispatch(accountingActions.setCreateWalletPopupProps({ isPopupOpened: false, walletName: null, walletId: null })),
        [dispatch],
    );

    return {
        formRef,
        isPopupOpened,
        handleSubmitClick,
        closeCreateWalletPopup,
    };
};
