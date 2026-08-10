import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { BalanceType } from '@/enums/balance-type';
import { useAppDispatch, useAppSelector } from '@store';
import { createWalletPopupPropsSelector } from '@store/admin';
import { balancesApi, useCreateFinancialAccountMutation, usePartiallyUpdateBalanceMutation } from '@store/api/balances-api';
import { handleError } from '@utils/handle-error';
import { translateByNamespace } from '@utils/i18n';

import { CreateWalletFormProps, CreateWalletFormState } from './create-wallet-form.types';

const t = translateByNamespace('admin:accounting:wallets-page:create-wallet-popup');

export const useCreateWalletForm = ({ onAfterSubmit }: Pick<CreateWalletFormProps, 'onAfterSubmit'>) => {
    const dispatch = useAppDispatch();
    const { walletId, walletName } = useAppSelector(createWalletPopupPropsSelector);
    const [createFinancialAccount] = useCreateFinancialAccountMutation();
    const [updateFinancialAccount] = usePartiallyUpdateBalanceMutation();

    const onSubmit = useCallback(
        async (values: CreateWalletFormState) => {
            try {
                if (walletId) {
                    await updateFinancialAccount({ balancePublicId: walletId, data: values }).unwrap();
                } else {
                    await createFinancialAccount({ ...values, type: BalanceType.CUSTOM_INTERNAL_WALLET }).unwrap();
                }

                dispatch(balancesApi.util.invalidateTags([{ type: 'FinancialBalances', id: 'LIST' }]));

                onAfterSubmit();
                toast.success(t<string>(`${walletId ? 'edit' : 'create'}-custom-wallet-success`));
            } catch (exception) {
                handleError(exception);
            }
        },
        [createFinancialAccount, updateFinancialAccount, onAfterSubmit, dispatch, walletId],
    );

    const initialValues = useMemo<CreateWalletFormState>(() => ({ name: walletName ?? '' }), [walletName]);

    return {
        initialValues,
        onSubmit,
    };
};
