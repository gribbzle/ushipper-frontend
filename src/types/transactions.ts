import { PaymentConfirmationType } from '@/enums/transactions/payment-confirmation-type';
import { TransactionStatusesEnum } from '@/enums/transactions/transaction-statuses-enum';
import { TransactionTypeGroup } from '@/enums/transactions/transaction-type-group';
import { TransactionTypesEnum } from '@/enums/transactions/transaction-types-enum';

export type TransactionsFiltersState = {
    createdAtFrom: string;
    createdAtTo: string;
    reasonCompanyId: string;
    reasonUserId: string;
    fundsMovement: TransactionTypesEnum;
    status: TransactionStatusesEnum;
    type: PaymentConfirmationType;
    accountId: string;
    orderId: string;
    typeGroup: TransactionTypeGroup;
};
