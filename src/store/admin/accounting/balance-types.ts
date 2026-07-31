import { BalanceType } from '@enums';

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
