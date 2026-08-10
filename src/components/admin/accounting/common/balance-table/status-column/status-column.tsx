import React from 'react';

import { TransactionStatusTag } from '@/components/common/table/common/transaction-status-tag/transaction-status-tag';
import { TransactionStatusTagProps } from '@/components/common/table/common/transaction-status-tag/transaction-status-tag-types';
import { PaymentConfirmationType, TransactionStatusesEnum } from '@/enums';
import { Transaction } from '@store/admin';

import { OrderPaymentConfirmationCheckTransactionTag } from '../order-payment-confirmation-check-transaction-tag';

type StatusColumnProps = TransactionStatusTagProps & Pick<Transaction, 'entity'>;

export const StatusColumn = ({ status, type, entity, amount, ...rest }: StatusColumnProps) => {
    const isOrderPaymentConfirmationCheckTransaction = type === PaymentConfirmationType.ORDER_PAYMENT_CONFIRMED_CHECK;
    const isTransferInitiatedStatus = status === TransactionStatusesEnum.PENDING;

    if (isOrderPaymentConfirmationCheckTransaction && isTransferInitiatedStatus) {
        return <OrderPaymentConfirmationCheckTransactionTag orderPublicId={entity?.data?.publicId} amount={amount} />;
    }

    return <TransactionStatusTag amount={amount} status={status} type={type} {...rest} />;
};
