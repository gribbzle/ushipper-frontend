import { AccountSubTypesEnum, BalanceType } from '@/enums';
import { BankAccount, BillingAddress, Card } from '@store/admin';

export type FinancialAccountFormValue = {
    accountCategory: string;
    type: BalanceType;
    name: string;
    bankAccountType: AccountSubTypesEnum;
    cardAccountType: AccountSubTypesEnum;
    bankAccount: BankAccount & { confirmAccountNumber: string };
    card: Card;
    billingAddress: BillingAddress;
};
