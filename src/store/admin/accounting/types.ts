import { Address } from '@/components/admin/accounting/owners-and-drivers/accounting-drawer/rocketkor';
import { AccountingTab } from '@components';
import {
    AccountSubTypesEnum,
    BalanceType,
    CarrierAccountingDrawerTab,
    InstantTermPaymentType,
    IssueStatus,
    PaymentConfirmationType,
    PaymentTerm,
    TransactionStatusesEnum,
    TransactionStatusGroupEnum,
    TransactionSystemEnum,
    TransactionTypesEnum,
} from '@enums';
import { AccountingAccountData, AccountingAccountUserData } from '@store/api/accounting-accounts-api';
import { AccountingProfileDocument, AccountInitiatePaymentMethod } from '@store/api/accounts-api';
import { User } from '@store/common';
import { Fee, FeeCategory } from '@types';

import { Company } from '../companies';
import { FuelTransactionLocation, FuelTransactionRawData } from '../fuel';

export type BalanceValue = {
    amount: string;
    currency: string;
    formatted: string;
};

export type BalanceResource = {
    publicId: string;
    name: string;
    type: BalanceType;
    balance: BalanceValue;
    pendingWithdrawal: BalanceValue;
    pendingDeposit: BalanceValue;
    pendingOrdersDeposit?: BalanceValue;
    displayedBalance: BalanceValue;
    isDefault: boolean;
    createdAt: string;
};

export type BankAccount = {
    bankName: string;
    routingNo: string;
    accountNumber: string;
    nameOnAccount: string;
};

export type MaskedBankAccount = BankAccount & { maskedAccountNumber: string };

export type Card = {
    firstName: string;
    middleName: string;
    lastName: string;
    number: string;
    expiry: string;
};

export type MaskedCard = Card & { maskedNumber: string };

export type BillingAddress = Address & { addressLine3: string };

export type FinancialBalanceData = BalanceResource & {
    accountingProfileId: string;
    accountId: string;
    accountName: string;
    availableBalance: BalanceValue;
    accountSubtype: AccountSubTypesEnum;
    bankAccount: MaskedBankAccount;
    card: MaskedCard;
    billingAddress: BillingAddress;
    feeCategories: FeeCategory[];
};

export type BalanceAmountType = 'positive' | 'negative';

export type FinancialBalanceFilters = Partial<{
    accountingProfileId: string;
    accountId: string;
    types: BalanceType[];
    balanceAmountType: BalanceAmountType;
    perPage: number;
    orderName: string;
    orderDirection: string;
    page: number;
    cursor: string | null;
}>;

export type CreateFinancialAccountValues = {
    accountSubtype?: AccountSubTypesEnum;
    type: BalanceType;
    name: string;
    bankAccount?: BankAccount;
    card?: Card;
    billingAddress?: BillingAddress;
    accountingProfileId?: string;
};

export type UpdateFinancialBalanceValues = {
    name: string;
    bankAccount?: BankAccount;
    card?: Pick<Card, 'firstName' | 'lastName' | 'middleName' | 'number' | 'expiry'>;
    billingAddress?: BillingAddress;
};

export type CreateTransactionPopupPropsState = {
    isPopupOpened: boolean;
    disabledSourceWallet: boolean;
    internalWalletId?: string;
    accountPublicId?: string;
};

export type InitiateAccountPaymentMethodsPopupPropsState = {
    isPopupOpened: boolean;
    accountPublicId: string | null;
    balanceId: string | null;
    data: AccountInitiatePaymentMethod | null;
};

export type CarrierAccountingDrawerPropsState = {
    isDrawerOpened: boolean;
    title: string | null;
    companyId: string | null;
    isPartner: boolean;
    enablePaymentSystem: boolean;
    selectedTab: CarrierAccountingDrawerTab | null;
};

export type CreateEditFeeCategoryBlockPropsState = {
    selectedFeeCategory: FeeCategory | null;
    isEditMode: boolean;
};

export type DeleteFeeCategoryPopupPropsState = {
    isVisible: boolean;
    feeCategoryId: number | null;
    feeCategoryName: string | null;
};

export type AccountingDrawerPropsState = {
    isDrawerOpened: boolean;
    accountId: string | null;
    selectedTab: AccountingTab | null;
    isRocketkorFormVisible: boolean;
    isFinancialFormVisible: boolean;
};

export type EditFinancialAccountPopupPropsState = {
    isPopupOpened: boolean;
    balancePublicId: string | null;
};

export type DeclineOrPayToDriverPopupPropsState = {
    isPopupOpened: boolean;
    orderPublicId: string | null;
    driverName: string | null;
    driverPay: string | null;
    instantTermPaymentType: InstantTermPaymentType.RECIPIENT_COMPANY_DECLINED | InstantTermPaymentType.RECIPIENT_COMPANY_PAID | null;
};

export type AlertStatusChangePopupPropsState = {
    isPopupOpened: boolean;
    issueId: number | null;
    issueStatus: IssueStatus | null;
};

export type DeleteFinancialAccountPopupPropsState = {
    isPopupOpened: boolean;
    balanceToDelete: FinancialBalanceData | null;
};

export type AddDriverToCompanyPopupPropsState = {
    isPopupOpened: boolean;
    name: string | null;
    email: string | null;
};

export type RocketkorDocumentsPopupsState = {
    isTaxDocumentPopupOpened: boolean;
    isOwnershipDocumentPopupOpened: boolean;
    isPassportPopupOpened: boolean;
    editDocument: AccountingProfileDocument | null;
};

export type SavedDocumentState = {
    files: File[];
    document: AccountingProfileDocument;
};

export type CancelRollbackTransactionMode = 'cancel' | 'rollback';

export type CancelRollbackTransactionPopupPropState = {
    isPopupOpened: boolean;
    transactionPublicId: string | null;
    mode: CancelRollbackTransactionMode;
};

export type AssignDispatcherToDriverPopupPropsState = {
    isPopupOpened: boolean;
    user: AccountingAccountUserData | null;
    reassign: boolean;
};

export type DriversMapPopupPropsState = {
    isPopupOpened: boolean;
    driverName: string | null;
    driverAccountId: string | null;
    users: AccountingAccountUserData[] | null;
};

export type DeleteAccountPopupPropsState = {
    isPopupOpened: boolean;
    accountName: string | null;
    accountId: string | null;
};

export type ReportType = 'statementV1' | 'statementV2' | 'cashout' | 'balance';

export type ReportPopupPropsState = {
    isPopupOpened: boolean;
    name: string | null;
    accountId: string | null;
    reportType: ReportType | null;
};

export type LinkFuelCardPopupPropsState = {
    isPopupOpened: boolean;
    accountId: string | null;
    driverName: string | null;
};

export type CreateWalletPopupPropsState = {
    isPopupOpened: boolean;
    walletName: string | null;
    walletId: string | null;
};

export type AccountingSliceState = {
    createTransactionPopupProps: CreateTransactionPopupPropsState;
    isCreateTransactionLoading: boolean;
    initiateAccountPaymentMethodsPopupProps: InitiateAccountPaymentMethodsPopupPropsState;
    isCreateAccountPaymentMethodsLoading: boolean;
    carrierAccountingDrawerProps: CarrierAccountingDrawerPropsState;
    createEditFeeCategoryBlockProps: CreateEditFeeCategoryBlockPropsState;
    deleteFeeCategoryPopupProps: DeleteFeeCategoryPopupPropsState;
    accountingDrawerProps: AccountingDrawerPropsState;
    selectedAccount: AccountingAccountData | null;
    rocketkorDocumentsPopupsProps: RocketkorDocumentsPopupsState;
    savedDocuments: SavedDocumentState[];
    isCreateAccountingProfileLoading: boolean;
    isEditRocketkor: boolean;
    editFinancialAccountPopupProps: EditFinancialAccountPopupPropsState;
    deleteFinancialAccountPopupProps: DeleteFinancialAccountPopupPropsState;
    addDriverToCompanyPopupProps: AddDriverToCompanyPopupPropsState;
    cancelRollbackTransactionPopupProps: CancelRollbackTransactionPopupPropState;
    assignDispatcherToDriverPopupProps: AssignDispatcherToDriverPopupPropsState;
    driversMapPopupProps: DriversMapPopupPropsState;
    deleteAccountPopupProps: DeleteAccountPopupPropsState;
    declineOrPayToDriverPopupProps: DeclineOrPayToDriverPopupPropsState;
    alertStatusChangePopupProps: AlertStatusChangePopupPropsState;
    linkFuelCardPopupProps: LinkFuelCardPopupPropsState;
    reportPopupProps: ReportPopupPropsState;
    createWalletPopupProps: CreateWalletPopupPropsState;
    fetchedBalance: FinancialBalanceData | null;
};

export type OrderReasonEntity = {
    publicId: string;
    orderId: string;
    company: Company | null;
    driver: User | null;
    type: 'carrier' | 'shipper';
};

export type ReasonEntity = {
    type: string;
    data: OrderReasonEntity;
};

export type TransactionBalanceResource = {
    name: string;
    publicId: string;
    accountId: string;
    accountName?: string;
    type: BalanceType;
    bankAccount?: {
        maskedNumber: string;
    };
    card?: {
        maskedNumber: string;
    };
};

export type TransactionMetadata = Partial<{
    usedFees: Fee[];
    baseAmount: BalanceValue;
    calculationBase: BalanceValue;
    instantTerm: PaymentTerm;
    delayedTerm: PaymentTerm;
    brokerFee: number | null;
    fuelCardTransaction: FuelTransactionRawData;
    fuelCardTransactionId: number;
    location: FuelTransactionLocation;
}>;

export type TransactionReasonAccount = Pick<
    AccountingAccountData,
    'name' | 'publicId' | 'email' | 'emailVerifiedAt' | 'phone' | 'phoneVerifiedAt' | 'status' | 'createdAt' | 'updatedAt' | 'ownerUser'
>;

export type RollbackTransaction = Pick<
    Transaction,
    | 'publicId'
    | 'createdAt'
    | 'type'
    | 'statusGroup'
    | 'status'
    | 'cancellationNotes'
    | 'metadata'
    | 'entity'
    | 'reasonAccount'
    | 'destinationBalance'
    | 'sourceBalance'
>;

export type ExternalInfo = {
    externalProvider: TransactionSystemEnum | null;
    externalId: string | null;
    externalStatus: string | null;
};

export type Transaction = {
    publicId: string;
    type: PaymentConfirmationType;
    amount: BalanceValue;
    amountBefore: BalanceValue | null;
    destinationBalance: TransactionBalanceResource | null;
    sourceBalance: TransactionBalanceResource | null;
    fundsMovement: TransactionTypesEnum;
    statusGroup: TransactionStatusGroupEnum;
    status: TransactionStatusesEnum;
    createdAt: string;
    entity?: ReasonEntity | null;
    notes?: string | null;
    cancellationNotes?: string | null;
    metadata: TransactionMetadata | null;
    reasonAccount: TransactionReasonAccount | null;
    rollbackTransaction?: RollbackTransaction | null;
} & ExternalInfo;
