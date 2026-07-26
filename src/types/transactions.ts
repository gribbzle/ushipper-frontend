import { PaymentConfirmationType, TransactionStatusesEnum, TransactionTypeGroup, TransactionTypesEnum } from '@/enums';

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
