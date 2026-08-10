import { FuelTransactionStatus } from '@/enums/fuel/fuel-transaction-status-enum';

export type FuelTransactionsFiltersFormState = {
    cardId: number;
    statuses: FuelTransactionStatus[];
    accountId: string;
    companyName: string;
};
