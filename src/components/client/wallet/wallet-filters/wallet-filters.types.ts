import { TransactionTypesEnum } from '@/enums';

export type WalletFiltersState = {
    createdAtFrom: string;
    createdAtTo: string;
    fundsMovement: TransactionTypesEnum;
};
