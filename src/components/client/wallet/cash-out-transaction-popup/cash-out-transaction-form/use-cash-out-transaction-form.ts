import { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

import { useHandleTransactionError } from '@hooks';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions } from '@store/admin';
import { balancesApi } from '@store/api/balances-api';
import { transactionsApi, useCreateTransactionMutation } from '@store/api/transactions-api';
import { authorizedUserAccountPublicIdSelector, authorizedUserDefaultBalanceSelector } from '@store/global';
import { convertDollarsToCents, translateByNamespace } from '@utils';

import { CashOutTransactionFormProps, CashOutTransactionFormState } from './cash-out-transaction-form.types';

const t = translateByNamespace('admin:accounting:factoring-balance:notifications');

export const useCashOutTransactionForm = ({ onAfterSubmit }: Pick<CashOutTransactionFormProps, 'onAfterSubmit'>) => {
    const [createTransaction, { isLoading: createLoading }] = useCreateTransactionMutation();

    const defaultBalance = useAppSelector(authorizedUserDefaultBalanceSelector);
    const accountId = useAppSelector(authorizedUserAccountPublicIdSelector);
    const dispatch = useAppDispatch();
    const { handleTransactionError } = useHandleTransactionError();

    useEffect(() => {
        dispatch(accountingActions.setIsCreateTransactionLoading(createLoading));
    }, [createLoading, dispatch]);

    const onSubmit = useCallback(
        async (values: CashOutTransactionFormState) => {
            if (defaultBalance) {
                const { amount, ...rest } = values;
                const convertedAmount = convertDollarsToCents(amount);

                try {
                    await createTransaction({ ...rest, amount: convertedAmount, sourceBalanceId: defaultBalance.publicId }).unwrap();

                    dispatch(transactionsApi.util.invalidateTags([{ type: 'Transactions', id: 'LIST' }]));
                    dispatch(balancesApi.util.invalidateTags([{ type: 'FinancialBalances', id: 'LIST' }]));

                    onAfterSubmit();
                    toast.success(t<string>('create-transaction-success'));
                } catch (exception) {
                    await handleTransactionError(exception, {
                        accountPublicId: accountId,
                        amount: convertedAmount,
                        destinationBalanceId: values.destinationBalanceId,
                    });
                }
            }
        },
        [defaultBalance, createTransaction, dispatch, onAfterSubmit, handleTransactionError, accountId],
    );

    return {
        onSubmit,
        accountId,
    };
};
