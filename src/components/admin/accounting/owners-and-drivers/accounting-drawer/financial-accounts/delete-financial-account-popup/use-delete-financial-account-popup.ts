import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, deleteFinancialAccountPopupPropsSelector, FinancialBalanceData } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { balancesApi, useDeleteBalanceMutation } from '@store/api/balances-api';
import { handleError } from '@utils/handle-error';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:notifications');

export const useDeleteFinancialAccountPopup = () => {
    const dispatch = useAppDispatch();
    const { isPopupOpened, balanceToDelete: deleteBalance } = useAppSelector(deleteFinancialAccountPopupPropsSelector);

    const [deleteFinancialBalance] = useDeleteBalanceMutation();

    const handleClose = useCallback(() => {
        dispatch(
            accountingActions.setDeleteFinancialAccountPopupProps({
                isPopupOpened: false,
                balanceToDelete: null,
            }),
        );
    }, [dispatch]);

    const handleFinancialAccountDelete = useCallback(async () => {
        if (deleteBalance) {
            try {
                await deleteFinancialBalance(deleteBalance.publicId).unwrap();

                toast.success<string>(t('delete-financial-account-success'));
                dispatch(balancesApi.util.invalidateTags([{ type: 'FinancialBalances', id: 'LIST' }]));
                dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));

                handleClose();
            } catch (error) {
                handleError(error);
            }
        }
    }, [deleteBalance, deleteFinancialBalance, dispatch, handleClose]);

    const openConfirmationModal = useCallback(
        (financialAccount: FinancialBalanceData | null) => {
            if (financialAccount) {
                dispatch(
                    accountingActions.setDeleteFinancialAccountPopupProps({
                        isPopupOpened: true,
                        balanceToDelete: financialAccount,
                    }),
                );
            }
        },
        [dispatch],
    );

    return { openConfirmationModal, handleFinancialAccountDelete, handleClose, deleteBalance, isPopupOpened };
};
