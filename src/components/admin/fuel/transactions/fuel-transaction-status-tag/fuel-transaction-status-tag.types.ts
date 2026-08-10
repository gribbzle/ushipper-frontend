import { FuelTransactionStatus } from '@/enums/fuel/fuel-transaction-status-enum';

export type FuelTransactionStatusTagProps = {
    status: FuelTransactionStatus;
    transactionId: number;
};
