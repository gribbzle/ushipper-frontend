import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { DropdownOption } from '@/components/common/dropdown/dropdown';
import { TransactionStatusesEnum } from '@/enums/transactions/transaction-statuses-enum';
import { TransactionSystemEnum } from '@/enums/preferences/transaction-system-enum';
import { useHandleTransactionError } from '@hooks';
import { useAppDispatch } from '@store';
import { accountingActions } from '@store/admin';
import { transactionsApi, useUpdateTransactionMutation } from '@store/api/transactions-api';
import { translateByNamespace } from '@utils/i18n';
import { isCashOut } from '@utils/transaction/get-is-cash-in-cash-out';
import { getTransactionStatusOptionTranslate, getTransactionStatusTranslate } from '@utils/translate/get-transaction-status-translate';

import { TransactionStatusTagProps } from './transaction-status-tag-types';

const t = translateByNamespace('admin:accounting:transactions-page');

const hasOptionsSet = new Set([
    TransactionStatusesEnum.NEW,
    TransactionStatusesEnum.IN_PROCESS,
    TransactionStatusesEnum.TRANSFER_INITIATED,
    TransactionStatusesEnum.INSUFFICIENT_FUNDS,
    TransactionStatusesEnum.PENDING,
    TransactionStatusesEnum.COMPLETED,
]);

export const useTransactionStatusTag = ({ amount, status, publicId, destinationBalance, externalProvider, type }: TransactionStatusTagProps) => {
    const dispatch = useAppDispatch();
    const [updateTransaction] = useUpdateTransactionMutation();
    const { handleTransactionError } = useHandleTransactionError();

    const statusText = useMemo(() => getTransactionStatusTranslate(status), [status]);
    const isMassPayProvider = externalProvider === TransactionSystemEnum.MASSPAY;
    const isCompletedStatus = status === TransactionStatusesEnum.COMPLETED;
    const cashOut = isCashOut({ confirmation: type, destinationType: destinationBalance?.type });
    const shouldRenderCompletedCashOutTooltip = isCompletedStatus && cashOut;

    const handleUpdateTransactionStatus = useCallback(
        async (value: TransactionStatusesEnum) => {
            try {
                await updateTransaction({ publicId, data: { status: value } }).unwrap();

                dispatch(transactionsApi.util.invalidateTags([{ type: 'Transactions', id: 'LIST' }]));
                toast.success<string>(t('updated-transaction-status-success'));
            } catch (exception) {
                const formattedAmount = Number(amount.amount);

                await handleTransactionError(exception, {
                    accountPublicId: destinationBalance?.accountId,
                    amount: formattedAmount,
                    destinationBalanceId: destinationBalance?.publicId,
                });
            }
        },
        [publicId, destinationBalance, amount, handleTransactionError, dispatch, updateTransaction],
    );

    const handleCancelRollbackTransaction = useCallback(
        async (mode: 'cancel' | 'rollback') =>
            dispatch(
                accountingActions.setCancelRollbackTransactionPopupProps({
                    isPopupOpened: true,
                    transactionPublicId: publicId,
                    mode,
                }),
            ),
        [publicId, dispatch],
    );

    const options: DropdownOption[] = useMemo(() => {
        const showCompletedOption = ![TransactionStatusesEnum.INSUFFICIENT_FUNDS, TransactionStatusesEnum.PENDING, TransactionStatusesEnum.COMPLETED].includes(
            status,
        );

        const showInProcessOption = !isMassPayProvider && showCompletedOption && status !== TransactionStatusesEnum.IN_PROCESS;
        const isPendingStatus = status === TransactionStatusesEnum.PENDING;

        return [
            {
                label: getTransactionStatusOptionTranslate(TransactionStatusesEnum.TRANSFER_INITIATED),
                onClick: () => handleUpdateTransactionStatus(TransactionStatusesEnum.TRANSFER_INITIATED),
                show: isPendingStatus,
            },
            {
                label: getTransactionStatusOptionTranslate(TransactionStatusesEnum.IN_PROCESS),
                onClick: () => handleUpdateTransactionStatus(TransactionStatusesEnum.IN_PROCESS),
                show: showInProcessOption,
            },
            {
                label: getTransactionStatusOptionTranslate(TransactionStatusesEnum.COMPLETED),
                onClick: () => handleUpdateTransactionStatus(TransactionStatusesEnum.COMPLETED),
                show: showCompletedOption && !isMassPayProvider,
            },
            {
                label: getTransactionStatusOptionTranslate(TransactionStatusesEnum.CANCELLED),
                onClick: () => handleCancelRollbackTransaction('cancel'),
                show: !isCompletedStatus && !isMassPayProvider,
            },
            {
                label: t('roll-back-option'),
                onClick: () => handleCancelRollbackTransaction('rollback'),
                show: isCompletedStatus && !isMassPayProvider,
            },
        ];
    }, [status, isMassPayProvider, isCompletedStatus, handleUpdateTransactionStatus, handleCancelRollbackTransaction]);

    const hasOptions = hasOptionsSet.has(status) && !isMassPayProvider;

    return { options, hasOptions, statusText, shouldRenderCompletedCashOutTooltip };
};
