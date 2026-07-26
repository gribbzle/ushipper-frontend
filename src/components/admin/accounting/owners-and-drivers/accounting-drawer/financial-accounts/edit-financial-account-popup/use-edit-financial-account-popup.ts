import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, editFinancialAccountPopupPropsSelector, isCreateAccountingProfileLoadingSelector } from '@store/admin';

import { useFinancialAccountForm } from '../financial-account-form';

export const useEditFinancialAccountPopup = () => {
    const { isPopupOpened } = useAppSelector(editFinancialAccountPopupPropsSelector);
    const { financialAccountFormId } = useFinancialAccountForm();
    const isLoading = useAppSelector(isCreateAccountingProfileLoadingSelector);

    const dispatch = useAppDispatch();

    const handleClosePopup = useCallback(async () => {
        dispatch(
            accountingActions.setEditFinancialAccountPopupProps({
                isPopupOpened: false,
                balancePublicId: null,
            }),
        );
    }, [dispatch]);

    return {
        isPopupOpened,
        financialAccountFormId,
        isLoading,
        handleClosePopup,
    };
};
