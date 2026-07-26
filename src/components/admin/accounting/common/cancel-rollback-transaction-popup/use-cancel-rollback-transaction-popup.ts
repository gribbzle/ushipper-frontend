import { useCallback, useRef } from 'react';
import { FormApi } from 'final-form';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { TransactionStatusesEnum } from '@/enums';
import { RequestError } from '@/shared';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { CancelRollbackTransactionFormState } from '@components';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, cancelRollbackTransactionPopupPropsSelector } from '@store/admin';
import { balancesApi } from '@store/api/balances-api';
import { transactionsApi, useUpdateTransactionMutation } from '@store/api/transactions-api';
import { translateTransactionStatusError, translateTransactionStatusSuccess } from '@utils';

export const useCancelRollbackTransactionPopup = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const balanceId = router.query['balance-id'] as string;
    const formRef = useRef<FormApi<CancelRollbackTransactionFormState>>();
    const { isPopupOpened, transactionPublicId, mode } = useAppSelector(cancelRollbackTransactionPopupPropsSelector);
    const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();

    const handleClose = useCallback(
        () =>
            dispatch(
                accountingActions.setCancelRollbackTransactionPopupProps({
                    isPopupOpened: false,
                    transactionPublicId: null,
                    mode: 'cancel',
                }),
            ),
        [dispatch],
    );

    const handleSubmit = useCallback(
        async ({ cancellationNotes }: CancelRollbackTransactionFormState) => {
            if (transactionPublicId) {
                try {
                    await updateTransaction({
                        publicId: transactionPublicId,
                        data: { status: mode === 'cancel' ? TransactionStatusesEnum.CANCELLED : TransactionStatusesEnum.REFUNDED, cancellationNotes },
                    }).unwrap();

                    dispatch(transactionsApi.util.invalidateTags([{ type: 'Transactions', id: 'LIST' }]));
                    dispatch(balancesApi.util.invalidateTags([{ type: 'FinancialBalances', id: 'LIST' }]));

                    if (balanceId) {
                        dispatch(balancesApi.util.invalidateTags([{ type: 'FinancialBalances', id: balanceId }]));
                    }

                    handleClose();
                    toast.success(translateTransactionStatusSuccess(mode));
                } catch (error) {
                    parseAndShowAxiosError(error as RequestError, translateTransactionStatusError(mode));
                }
            }
        },
        [transactionPublicId, updateTransaction, mode, balanceId, dispatch, handleClose],
    );

    const handleCancelRollbackTransactionClick = useCallback(() => formRef.current?.submit(), []);

    return { handleCancelRollbackTransactionClick, handleSubmit, handleClose, mode, isLoading, isPopupOpened, formRef };
};
