import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { DropdownOption } from '@/components/common';
import { FuelTransactionStatus } from '@/enums';
import { RequestError } from '@/shared';
import parseAndShowAxiosError from '@/utils/parse-axios-error';
import { useFuelTransactionsActionsPermission } from '@hooks';
import { useAppDispatch } from '@store';
import { fuelCardsApi, usePartiallyUpdateFuelTransactionMutation } from '@store/api/fuel-cards-api';
import { translateByNamespace } from '@utils';

import { FuelTransactionStatusTagProps } from './fuel-transaction-status-tag';

const t = translateByNamespace('admin:fuel:transactions-page:table');
const tNot = translateByNamespace('admin:fuel:transactions-page:notifications');

export const useFuelTransactionStatusTag = ({ transactionId, status }: FuelTransactionStatusTagProps) => {
    const dispatch = useAppDispatch();
    const [updateFuelTransaction] = usePartiallyUpdateFuelTransactionMutation();
    const hasFuelTransactionActionsPermission = useFuelTransactionsActionsPermission();

    const disabled = useMemo(
        (): boolean => !hasFuelTransactionActionsPermission || status !== FuelTransactionStatus.PENDING,
        [status, hasFuelTransactionActionsPermission],
    );

    const changeFuelTransactionStatusHandler = useCallback(
        async (status: FuelTransactionStatus) => {
            try {
                await updateFuelTransaction({ transactionId, data: { status } }).unwrap();
                dispatch(fuelCardsApi.util.invalidateTags([{ type: 'FuelTransactions', id: 'LIST' }]));

                toast.success(tNot<string>('update-fuel-transaction-success'));
            } catch (exception) {
                parseAndShowAxiosError(exception as RequestError, tNot<string>('update-fuel-transaction-error'));
            }
        },
        [dispatch, updateFuelTransaction, transactionId],
    );

    const options = useMemo(
        (): DropdownOption[] => [
            {
                label: t('in-process-option'),
                onClick: () => changeFuelTransactionStatusHandler(FuelTransactionStatus.IN_PROCESS),
                show: status === FuelTransactionStatus.PENDING,
            },
        ],
        [changeFuelTransactionStatusHandler, status],
    );

    return { options, disabled };
};
