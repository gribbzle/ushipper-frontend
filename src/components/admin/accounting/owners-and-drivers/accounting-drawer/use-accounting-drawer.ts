import { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { TabItemBase } from '@/components/common';
import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, accountingDrawerPropsSelector, selectedAccountSelector } from '@store/admin';
import { useLazyGetAccountingAccountQuery } from '@store/api/accounting-accounts-api';
import { translateByNamespace } from '@utils';

import { useRocketkorForm } from './rocketkor/rocketkor-form/use-rocketkor-form';
import { AccountingTab } from './accounting-drawer-tabs';
import { useAgreementsDetails } from './agreements-details';
import { useFinancialAccountForm } from './financial-accounts';
import { useHandleCloseAccountingDrawer } from './hooks';

const t = translateByNamespace('admin:accounting:notifications');

export const useAccountingDrawer = () => {
    const { isDrawerOpened, accountId, selectedTab } = useAppSelector(accountingDrawerPropsSelector);
    const account = useAppSelector(selectedAccountSelector);

    const { handleCloseDrawer } = useHandleCloseAccountingDrawer();
    const dispatch = useAppDispatch();
    const [getAccount, { isLoading, isSuccess, isError }] = useLazyGetAccountingAccountQuery();
    const errorText = t('upload-account-error');

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                if (!accountId) {
                    dispatch(accountingActions.clearSelectedAccount());

                    return;
                }

                await getAccount(accountId).unwrap();
            } catch {
                toast.error<string>(errorText);
                dispatch(accountingActions.clearSelectedAccount());
            }
        };

        fetchAccount();
    }, [accountId, errorText, dispatch, getAccount]);

    const { agreementsFormId } = useAgreementsDetails();
    const { rocketkorFormId } = useRocketkorForm();
    const { financialAccountFormId } = useFinancialAccountForm();

    const formId = useMemo(() => {
        if (selectedTab === AccountingTab.FINANCIAL_ACCOUNTS) {
            return financialAccountFormId;
        }

        if (selectedTab === AccountingTab.ROCKETKOR) {
            return rocketkorFormId;
        }

        return agreementsFormId;
    }, [selectedTab, agreementsFormId, rocketkorFormId, financialAccountFormId]);

    const onSelectTabHandler = useCallback(
        ({ value }: TabItemBase) => {
            dispatch(
                accountingActions.setAccountingDrawerProps({
                    selectedTab: value as AccountingTab,
                    isRocketkorFormVisible: false,
                    isFinancialFormVisible: false,
                }),
            );
        },
        [dispatch],
    );

    return {
        formId,
        account,
        selectedTab,
        isDrawerOpened,
        isError,
        isLoading,
        isSuccess,
        errorText,
        dispatch,
        handleCloseDrawer,
        onSelectTabHandler,
    };
};
