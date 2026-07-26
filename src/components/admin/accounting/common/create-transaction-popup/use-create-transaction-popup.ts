import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, createTransactionPopupPropsSelector } from '@store/admin';

import { CreateTransactionFormState } from './create-transaction-form';

export const useCreateTransactionPopup = () => {
    const { isPopupOpened, disabledSourceWallet } = useAppSelector(createTransactionPopupPropsSelector);
    const formRef = useRef<FormApi<CreateTransactionFormState>>();

    const dispatch = useAppDispatch();

    const handleSubmitClick = () => {
        if (formRef.current) {
            formRef.current.submit();
        }
    };

    const closeCreateTransactionPopup = useCallback(() => {
        dispatch(
            accountingActions.setCreateTransactionPopupProps({
                isPopupOpened: false,
                disabledSourceWallet: false,
                internalWalletId: undefined,
                accountPublicId: undefined,
            }),
        );
    }, [dispatch]);

    const openCreateTransactionPopup = useCallback(
        ({
            disabledSourceWallet,
            internalWalletId,
            accountPublicId,
        }: {
            disabledSourceWallet: boolean;
            internalWalletId?: string;
            accountPublicId?: string;
        }) => {
            dispatch(accountingActions.setCreateTransactionPopupProps({ isPopupOpened: true, disabledSourceWallet, internalWalletId, accountPublicId }));
        },
        [dispatch],
    );

    return {
        formRef,
        isPopupOpened,
        disabledSourceWallet,
        handleSubmitClick,
        closeCreateTransactionPopup,
        openCreateTransactionPopup,
    };
};
