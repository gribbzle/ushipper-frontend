import { BalanceAmountType } from '@store/admin';

export type WalletsFiltersFormState = {
    search: string;
    balanceAmountType: BalanceAmountType;
    type: 'custom' | 'system';
};
