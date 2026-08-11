import { AccountSubTypesEnum } from '@/enums/account-subtypes-enum';
import { Address } from '@/types/address';
import { FeeCategory } from '@/types/fee-category';

import { BalanceResource, BalanceValue } from './balance-types';

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
