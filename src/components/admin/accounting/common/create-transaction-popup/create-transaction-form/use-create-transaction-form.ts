import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { BalanceType, TransactionTypesEnum } from '@/enums';
import { useHandleTransactionError, useInvalidateSelectedAccountTags } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, createTransactionPopupPropsSelector } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { balanceStatisticsApi } from '@store/api/balance-statistic-api';
import { balancesApi, useGetBalancesQuery } from '@store/api/balances-api';
import { transactionsApi, useCreateTransactionMutation } from '@store/api/transactions-api';
import { convertDollarsToCents } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

import { CreateTransactionFormProps, CreateTransactionFormState } from './create-transaction-form.types';

const t = translateByNamespace('admin:accounting:factoring-balance:notifications');

export const useCreateTransactionForm = ({ formRef, onAfterSubmit, context, disabledSourceWallet }: CreateTransactionFormProps) => {
    const [createTransaction, { isLoading }] = useCreateTransactionMutation();
    const { handleTransactionError } = useHandleTransactionError();
    const invalidateSelectedAccountTags = useInvalidateSelectedAccountTags();

    const { internalWalletId, accountPublicId } = useAppSelector(createTransactionPopupPropsSelector);
    const dispatch = useAppDispatch();
    const isInternalUserContext = context === BalanceType.INTERNAL_USER_WALLET;
    const isCustomInternalWalletContext = context === BalanceType.CUSTOM_INTERNAL_WALLET;

    const { data: balanceWallet } = useGetBalancesQuery({ types: [context] }, { skip: isInternalUserContext });

    useEffect(() => {
        dispatch(accountingActions.setIsCreateTransactionLoading(isLoading));
    }, [isLoading, dispatch]);

    const onSubmit = useCallback(
        async (values: CreateTransactionFormState) => {
            const { type, amount, ...rest } = values;
            const convertedAmount = convertDollarsToCents(amount);

            try {
                await createTransaction({ ...rest, amount: convertedAmount }).unwrap();

                if (isInternalUserContext) {
                    dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
                    dispatch(balanceStatisticsApi.util.invalidateTags([{ type: 'BalanceStatistics' }]));
                } else if (isCustomInternalWalletContext) {
                    const customInternalWalletId = type === TransactionTypesEnum.OUTGOING ? values.sourceBalanceId : values?.destinationBalanceId;

                    dispatch(balancesApi.util.invalidateTags([{ type: 'FinancialBalances', id: customInternalWalletId }]));
                } else {
                    dispatch(balancesApi.util.invalidateTags([{ type: 'FinancialBalances', id: 'LIST' }]));
                }

                dispatch(transactionsApi.util.invalidateTags([{ type: 'Transactions', id: 'LIST' }]));

                invalidateSelectedAccountTags();
                onAfterSubmit();
                toast.success(t<string>('create-transaction-success'));
            } catch (exception) {
                await handleTransactionError(exception, {
                    accountPublicId,
                    amount: convertedAmount,
                    destinationBalanceId: values.destinationBalanceId,
                });
            }
        },
        [
            createTransaction,
            isInternalUserContext,
            isCustomInternalWalletContext,
            dispatch,
            invalidateSelectedAccountTags,
            onAfterSubmit,
            handleTransactionError,
            accountPublicId,
        ],
    );

    const currentBalanceId = useMemo(() => {
        const internalUserWalletId = internalWalletId ?? '';
        const balanceWalletId = balanceWallet?.data[0].publicId ?? '';

        return isInternalUserContext ? internalUserWalletId : balanceWalletId;
    }, [isInternalUserContext, internalWalletId, balanceWallet]);

    const initialValues = useMemo<CreateTransactionFormState>(
        () => ({
            type: TransactionTypesEnum.INCOMING,
            destinationBalanceId: currentBalanceId,
        }),
        [currentBalanceId],
    );

    const handleTypeChange = useCallback(async () => {
        if (formRef.current) {
            const { initialize, getState } = formRef.current;
            const { type, destinationBalanceId, sourceBalanceId, ...rest } = await getState().values;

            if (type === TransactionTypesEnum.INCOMING) {
                await initialize({
                    ...rest,
                    type,
                    destinationBalanceId: disabledSourceWallet ? currentBalanceId : sourceBalanceId,
                    sourceBalanceId: destinationBalanceId,
                });
            } else {
                await initialize({
                    ...rest,
                    type,
                    destinationBalanceId: sourceBalanceId,
                    sourceBalanceId: disabledSourceWallet ? currentBalanceId : destinationBalanceId,
                });
            }
        }
    }, [formRef, currentBalanceId, disabledSourceWallet]);

    return {
        initialValues,
        isInternalUserContext,
        onSubmit,
        handleTypeChange,
    };
};
