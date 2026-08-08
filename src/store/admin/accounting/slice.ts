import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AccountingAccountData, accountingAccountsApi } from '@store/api/accounting-accounts-api';
import { FinancialBalanceData } from '@store/admin';

import {
    AccountingDrawerPropsState,
    AccountingSliceState,
    AddDriverToCompanyPopupPropsState,
    AlertStatusChangePopupPropsState,
    AssignDispatcherToDriverPopupPropsState,
    CancelRollbackTransactionPopupPropState,
    CarrierAccountingDrawerPropsState,
    CreateEditFeeCategoryBlockPropsState,
    CreateTransactionPopupPropsState,
    CreateWalletPopupPropsState,
    DeclineOrPayToDriverPopupPropsState,
    DeleteAccountPopupPropsState,
    DeleteFeeCategoryPopupPropsState,
    DeleteFinancialAccountPopupPropsState,
    DriversMapPopupPropsState,
    EditFinancialAccountPopupPropsState,
    InitiateAccountPaymentMethodsPopupPropsState,
    LinkFuelCardPopupPropsState,
    ReportPopupPropsState,
    RocketkorDocumentsPopupsState,
    SavedDocumentState,
} from './types';

const initialState: AccountingSliceState = {
    createTransactionPopupProps: {
        isPopupOpened: false,
        disabledSourceWallet: false,
    },
    isCreateTransactionLoading: false,
    initiateAccountPaymentMethodsPopupProps: {
        isPopupOpened: false,
        accountPublicId: null,
        balanceId: null,
        data: null,
    },
    isCreateAccountPaymentMethodsLoading: false,
    carrierAccountingDrawerProps: {
        isDrawerOpened: false,
        title: null,
        companyId: null,
        isPartner: false,
        selectedTab: null,
        enablePaymentSystem: false,
    },
    createEditFeeCategoryBlockProps: {
        selectedFeeCategory: null,
        isEditMode: true,
    },
    deleteFeeCategoryPopupProps: {
        isVisible: false,
        feeCategoryId: null,
        feeCategoryName: null,
    },
    rocketkorDocumentsPopupsProps: {
        isOwnershipDocumentPopupOpened: false,
        isPassportPopupOpened: false,
        isTaxDocumentPopupOpened: false,
        editDocument: null,
    },
    accountingDrawerProps: {
        isDrawerOpened: false,
        accountId: null,
        selectedTab: null,
        isRocketkorFormVisible: false,
        isFinancialFormVisible: false,
    },
    savedDocuments: [],
    isCreateAccountingProfileLoading: false,
    isEditRocketkor: false,
    editFinancialAccountPopupProps: {
        isPopupOpened: false,
        balancePublicId: null,
    },
    deleteFinancialAccountPopupProps: {
        isPopupOpened: false,
        balanceToDelete: null,
    },
    addDriverToCompanyPopupProps: {
        isPopupOpened: false,
        name: null,
        email: null,
    },
    cancelRollbackTransactionPopupProps: {
        isPopupOpened: false,
        transactionPublicId: null,
        mode: 'cancel',
    },
    assignDispatcherToDriverPopupProps: {
        isPopupOpened: false,
        user: null,
        reassign: false,
    },
    driversMapPopupProps: {
        isPopupOpened: false,
        driverName: null,
        driverAccountId: null,
        users: null,
    },
    deleteAccountPopupProps: {
        isPopupOpened: false,
        accountId: null,
        accountName: null,
    },
    declineOrPayToDriverPopupProps: {
        isPopupOpened: false,
        orderPublicId: null,
        driverName: null,
        driverPay: null,
        instantTermPaymentType: null,
    },
    alertStatusChangePopupProps: {
        isPopupOpened: false,
        issueId: null,
        issueStatus: null,
    },
    reportPopupProps: {
        reportType: null,
        isPopupOpened: false,
        name: null,
        accountId: null,
    },
    linkFuelCardPopupProps: {
        isPopupOpened: false,
        accountId: null,
        driverName: null,
    },
    createWalletPopupProps: {
        isPopupOpened: false,
        walletName: null,
        walletId: null,
    },
    fetchedBalance: null,
    selectedAccount: null,
};

const accountingSlice = createSlice({
    name: 'accounting',
    initialState,
    reducers: {
        setCreateTransactionPopupProps: (state, action: PayloadAction<CreateTransactionPopupPropsState>) => {
            state.createTransactionPopupProps = action.payload;
        },
        setIsCreateTransactionLoading: (state, action: PayloadAction<boolean>) => {
            state.isCreateTransactionLoading = action.payload;
        },
        setInitiateAccountPaymentMethodsPopupProps: (state, action: PayloadAction<InitiateAccountPaymentMethodsPopupPropsState>) => {
            state.initiateAccountPaymentMethodsPopupProps = action.payload;
        },
        setIsCreateAccountPaymentMethodsLoading: (state, action: PayloadAction<boolean>) => {
            state.isCreateAccountPaymentMethodsLoading = action.payload;
        },
        setCarrierAccountingDrawerProps: (state, action: PayloadAction<Partial<CarrierAccountingDrawerPropsState>>) => {
            state.carrierAccountingDrawerProps = { ...state.carrierAccountingDrawerProps, ...action.payload };
        },
        setCreateEditFeeCategoryBlockProps: (state, action: PayloadAction<Partial<CreateEditFeeCategoryBlockPropsState>>) => {
            state.createEditFeeCategoryBlockProps = { ...state.createEditFeeCategoryBlockProps, ...action.payload };
        },
        setDeleteFeeCategoryPopupProps: (state, action: PayloadAction<DeleteFeeCategoryPopupPropsState>) => {
            state.deleteFeeCategoryPopupProps = action.payload;
        },
        setAccountingDrawerProps: (state, action: PayloadAction<Partial<AccountingDrawerPropsState>>) => {
            state.accountingDrawerProps = { ...state.accountingDrawerProps, ...action.payload };
        },
        setRocketkorDocumentPopupProps: (state, action: PayloadAction<Partial<RocketkorDocumentsPopupsState>>) => {
            state.rocketkorDocumentsPopupsProps = { ...state.rocketkorDocumentsPopupsProps, ...action.payload };
        },
        addSavedDocuments: (state, action: PayloadAction<SavedDocumentState>) => {
            state.savedDocuments = [...state.savedDocuments, action.payload];
        },
        clearSavedDocuments: state => {
            state.savedDocuments = [];
        },
        setIsCreateAccountingProfileLoading: (state, action: PayloadAction<boolean>) => {
            state.isCreateAccountingProfileLoading = action.payload;
        },
        setIsEditRocketkor: (state, action: PayloadAction<boolean>) => {
            state.isEditRocketkor = action.payload;
        },
        setEditFinancialAccountPopupProps: (state, action: PayloadAction<Partial<EditFinancialAccountPopupPropsState>>) => {
            state.editFinancialAccountPopupProps = { ...state.editFinancialAccountPopupProps, ...action.payload };
        },
        setDeleteFinancialAccountPopupProps: (state, action: PayloadAction<Partial<DeleteFinancialAccountPopupPropsState>>) => {
            state.deleteFinancialAccountPopupProps = { ...state.deleteFinancialAccountPopupProps, ...action.payload };
        },
        setAddDriverToCompanyPopupProps: (state, action: PayloadAction<AddDriverToCompanyPopupPropsState>) => {
            state.addDriverToCompanyPopupProps = action.payload;
        },
        setCancelRollbackTransactionPopupProps: (state, action: PayloadAction<Partial<CancelRollbackTransactionPopupPropState>>) => {
            state.cancelRollbackTransactionPopupProps = { ...state.cancelRollbackTransactionPopupProps, ...action.payload };
        },
        setAssignDispatcherToDriverPopupProps: (state, action: PayloadAction<AssignDispatcherToDriverPopupPropsState>) => {
            state.assignDispatcherToDriverPopupProps = action.payload;
        },
        setDriversMapPopupProps: (state, action: PayloadAction<DriversMapPopupPropsState>) => {
            state.driversMapPopupProps = action.payload;
        },
        setDeleteAccountPopupProps: (state, action: PayloadAction<DeleteAccountPopupPropsState>) => {
            state.deleteAccountPopupProps = action.payload;
        },
        setDeclineOrPayToDriverPopupProps: (state, action: PayloadAction<DeclineOrPayToDriverPopupPropsState>) => {
            state.declineOrPayToDriverPopupProps = action.payload;
        },
        setAlertStatusChangePopupProps: (state, action: PayloadAction<AlertStatusChangePopupPropsState>) => {
            state.alertStatusChangePopupProps = action.payload;
        },
        setReportPopupProps: (state, action: PayloadAction<ReportPopupPropsState>) => {
            state.reportPopupProps = action.payload;
        },
        setLinkFuelCardPopupProps: (state, action: PayloadAction<LinkFuelCardPopupPropsState>) => {
            state.linkFuelCardPopupProps = action.payload;
        },
        setCreateWalletPopupProps: (state, action: PayloadAction<CreateWalletPopupPropsState>) => {
            state.createWalletPopupProps = action.payload;
        },
        setFetchedBalance: (state, action: PayloadAction<FinancialBalanceData | null>) => {
            state.fetchedBalance = action.payload;
        },
        clearSelectedAccount: state => {
            state.selectedAccount = null;
        },
        setSelectedAccount: (state, action: PayloadAction<AccountingAccountData>) => {
            state.selectedAccount = action.payload;
        },
        updateSelectedAccount: (state, action: PayloadAction<AccountingAccountData>) => {
            if (state.selectedAccount && state.selectedAccount.publicId === action.payload.publicId) {
                state.selectedAccount = action.payload;
            }
        },
    },
    extraReducers: builder => {
        builder.addMatcher(accountingAccountsApi.endpoints.getAccountingAccount.matchFulfilled, (state, { payload }) => {
            state.selectedAccount = payload;
        });
    },
});

export const accountingActions = accountingSlice.actions;

export const accountingReducer = accountingSlice.reducer;
