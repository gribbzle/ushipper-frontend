import { useCallback } from 'react';

import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';

import { useDeleteFinancialAccountPopup } from '../delete-financial-account-popup';

export const useFinancialAccountsList = () => {
    const { openConfirmationModal } = useDeleteFinancialAccountPopup();
    const dispatch = useAppDispatch();

    const handleFinancialAccountEdit = useCallback(
        (balancePublicId: string) =>
            dispatch(
                accountingActions.setEditFinancialAccountPopupProps({
                    isPopupOpened: true,
                    balancePublicId,
                }),
            ),
        [dispatch],
    );

    return { handleFinancialAccountEdit, openConfirmationModal };
};
