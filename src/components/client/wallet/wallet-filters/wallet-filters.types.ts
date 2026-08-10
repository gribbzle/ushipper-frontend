import { TransactionTypesEnum } from '@/enums/transactions/transaction-types-enum';

export type WalletFiltersState = {
    createdAtFrom: string;
    createdAtTo: string;
    fundsMovement: TransactionTypesEnum;
};
