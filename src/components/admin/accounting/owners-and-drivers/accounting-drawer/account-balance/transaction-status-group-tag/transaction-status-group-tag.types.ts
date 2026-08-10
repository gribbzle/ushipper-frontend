import { TransactionStatusGroupEnum } from '@/enums/transactions/transaction-status-group-enum';

export type TransactionStatusGroupTagProps = {
    text: string;
    view?: TransactionStatusGroupEnum;
};
