import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, editFinancialAccountPopupPropsSelector } from '@store/admin';
import { accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { balancesApi, useCreateFinancialAccountMutation, useGetBalanceQuery, usePartiallyUpdateBalanceMutation } from '@store/api/balances-api';
import { handleError, translateByNamespace } from '@utils';

import { useGetAccountingProfile } from '../../hooks';

import { FinancialAccountFormValue } from './financial-account-form.types';
import { getFinancialAccountInitialValues, prepareCreateFinancialAccountData, prepareEditFinancialAccountData } from './utils';

const t = translateByNamespace('admin:accounting:notifications');

export const useFinancialAccountForm = () => {
    const financialAccountFormId = 'financialAccountFormId';
    const { accountingProfile, account } = useGetAccountingProfile();
    const dispatch = useAppDispatch();

    const [createFinancialAccount] = useCreateFinancialAccountMutation();
    const [updateFinancialAccount] = usePartiallyUpdateBalanceMutation();

    const { balancePublicId, isPopupOpened: isEdit } = useAppSelector(editFinancialAccountPopupPropsSelector);

    const { data: balance } = useGetBalanceQuery(balancePublicId ?? '', { skip: !balancePublicId });

    const initialValues = useMemo<Partial<FinancialAccountFormValue>>(() => getFinancialAccountInitialValues(balance), [balance]);

    const handleSubmit = useCallback(
        async (values: FinancialAccountFormValue) => {
            try {
                if (account && accountingProfile) {
                    dispatch(accountingActions.setIsCreateAccountingProfileLoading(true));

                    if (balancePublicId) {
                        await updateFinancialAccount({
                            balancePublicId,
                            data: prepareEditFinancialAccountData(values),
                        }).unwrap();

                        toast.success<string>(t('update-financial-account-success'));
                        dispatch(
                            accountingActions.setEditFinancialAccountPopupProps({
                                isPopupOpened: false,
                                balancePublicId: null,
                            }),
                        );
                    } else {
                        await createFinancialAccount(prepareCreateFinancialAccountData(values, accountingProfile.publicId)).unwrap();

                        toast.success<string>(t('create-financial-account-success'));
                        dispatch(
                            accountingActions.setAccountingDrawerProps({
                                isFinancialFormVisible: false,
                            }),
                        );
                    }

                    dispatch(balancesApi.util.invalidateTags([{ type: 'FinancialBalances', id: 'LIST' }]));
                    dispatch(accountingAccountsApi.util.invalidateTags([{ type: 'AccountingAccounts', id: 'LIST' }]));
                }
            } catch (error) {
                handleError(error);
            }

            dispatch(accountingActions.setIsCreateAccountingProfileLoading(false));
        },
        [account, accountingProfile, balancePublicId, createFinancialAccount, dispatch, updateFinancialAccount],
    );

    return {
        initialValues,
        financialAccountFormId,
        isEdit,
        handleSubmit,
    };
};
