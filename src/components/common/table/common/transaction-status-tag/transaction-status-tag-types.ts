import { Transaction } from '@store/admin';

export type TransactionStatusTagProps = Pick<
    Transaction,
    'amount' | 'status' | 'publicId' | 'destinationBalance' | 'sourceBalance' | 'type' | 'externalProvider'
> & {
    isClickable?: boolean;
};
