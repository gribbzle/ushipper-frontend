import { FuelTransactionStatus } from '@/enums';

export type FuelTransactionsFiltersFormState = {
    cardId: number;
    statuses: FuelTransactionStatus[];
    accountId: string;
    companyName: string;
};
