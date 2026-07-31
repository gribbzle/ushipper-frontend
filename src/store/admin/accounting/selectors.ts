import { BalanceType } from '@/enums';
import { AccountingAccountData } from '@store/api/accounting-accounts-api';

type AppState = {
    admin: {
        accounting: any;
    };
};

import {
    AccountingDrawerPropsState,
    AddDriverToCompanyPopupPropsState,
    AlertStatusChangePopupPropsState,
    AssignDispatcherToDriverPopupPropsState,
    CreateTransactionPopupPropsState,
    CreateWalletPopupPropsState,
    DeclineOrPayToDriverPopupPropsState,
    DeleteAccountPopupPropsState,
    DriversMapPopupPropsState,
    FinancialBalanceData,
    InitiateAccountPaymentMethodsPopupPropsState,
    LinkFuelCardPopupPropsState,
    ReportPopupPropsState,
} from './types';

const accountingSelectors = (state: AppState) => state.admin.accounting;

export const createTransactionPopupPropsSelector = (state: AppState): CreateTransactionPopupPropsState =>
    accountingSelectors(state).createTransactionPopupProps;

export const isCreateTransactionLoadingSelector = (state: AppState): boolean => accountingSelectors(state).isCreateTransactionLoading;

export const initiateAccountPaymentMethodsPopupPropsSelector = (state: AppState): InitiateAccountPaymentMethodsPopupPropsState =>
    accountingSelectors(state).initiateAccountPaymentMethodsPopupProps;

export const isCreateAccountPaymentMethodsLoadingSelector = (state: AppState): boolean => accountingSelectors(state).isCreateAccountPaymentMethodsLoading;

export const carrierAccountingDrawerPropsSelector = (state: AppState) => accountingSelectors(state).carrierAccountingDrawerProps;

export const createEditFeeCategoryBlockPropsSelector = (state: AppState) => accountingSelectors(state).createEditFeeCategoryBlockProps;

export const deleteFeeCategoryPopupSelector = (state: AppState) => accountingSelectors(state).deleteFeeCategoryPopupProps;

export const accountingDrawerPropsSelector = (state: AppState): AccountingDrawerPropsState => accountingSelectors(state).accountingDrawerProps;

export const selectedAccountSelector = (state: AppState): AccountingAccountData | null => accountingSelectors(state).selectedAccount;

export const balancesFromSelectedAccountSelector = (state: AppState) => {
    const account = selectedAccountSelector(state);

    return account?.balances ?? [];
};

export const internalUserWalletFromSelectedAccountSelector = (state: AppState) => {
    const account = selectedAccountSelector(state);
    const { balances } = account || {};

    return balances?.find(balance => balance.type === BalanceType.INTERNAL_USER_WALLET);
};

export const rocketkorDocumentsPopupsPropsSelector = (state: AppState) => accountingSelectors(state).rocketkorDocumentsPopupsProps;

export const savedDocumentsSelector = (state: AppState) => accountingSelectors(state).savedDocuments;

export const isCreateAccountingProfileLoadingSelector = (state: AppState) => accountingSelectors(state).isCreateAccountingProfileLoading;

export const isEditRocketkorSelector = (state: AppState) => accountingSelectors(state).isEditRocketkor;

export const editFinancialAccountPopupPropsSelector = (state: AppState) => accountingSelectors(state).editFinancialAccountPopupProps;

export const deleteFinancialAccountPopupPropsSelector = (state: AppState) => accountingSelectors(state).deleteFinancialAccountPopupProps;

export const addDriverToCompanyPopupPropsSelector = (state: AppState): AddDriverToCompanyPopupPropsState =>
    accountingSelectors(state).addDriverToCompanyPopupProps;

export const cancelRollbackTransactionPopupPropsSelector = (state: AppState) => accountingSelectors(state).cancelRollbackTransactionPopupProps;

export const assignDispatcherToDriverPopupPropsSelector = (state: AppState): AssignDispatcherToDriverPopupPropsState =>
    accountingSelectors(state).assignDispatcherToDriverPopupProps;

export const driversMapPopupPropsSelector = (state: AppState): DriversMapPopupPropsState => accountingSelectors(state).driversMapPopupProps;

export const deleteAccountPopupPropsSelector = (state: AppState): DeleteAccountPopupPropsState => accountingSelectors(state).deleteAccountPopupProps;

export const declineOrPayToDriverPopupPropsSelector = (state: AppState): DeclineOrPayToDriverPopupPropsState =>
    accountingSelectors(state).declineOrPayToDriverPopupProps;

export const alertStatusChangePopupPropsSelector = (state: AppState): AlertStatusChangePopupPropsState =>
    accountingSelectors(state).alertStatusChangePopupProps;

export const linkFuelCardPopupPropsSelector = (state: AppState): LinkFuelCardPopupPropsState => accountingSelectors(state).linkFuelCardPopupProps;

export const reportPopupPropsSelector = (state: AppState): ReportPopupPropsState => accountingSelectors(state).reportPopupProps;

export const createWalletPopupPropsSelector = (state: AppState): CreateWalletPopupPropsState => accountingSelectors(state).createWalletPopupProps;

export const fetchedBalanceSelector = (state: AppState): FinancialBalanceData | null => accountingSelectors(state).fetchedBalance;
