import React, { useMemo } from 'react';

import { PaymentConfirmationType } from '@/enums/transactions/payment-confirmation-type';
import { RollbackTransaction } from '@store/admin';
import { translateByNamespace } from '@utils/i18n';

import { DriverInfo } from '../driver-info';
import { useFeesInfo, usePaymentConfirmationText } from '../hooks';
import { NoteInfo } from '../note-info';
import { OrderInfo } from '../order-info';

const t = translateByNamespace('admin:accounting:balance-table');

export type RollbackTransactionInfoProps = RollbackTransaction;

export const RollbackTransactionInfo = ({
    publicId,
    createdAt,
    type,
    entity,
    metadata,
    reasonAccount,
    cancellationNotes,
    destinationBalance,
    sourceBalance,
}: RollbackTransactionInfoProps) => {
    const isRecurringTransaction = type === PaymentConfirmationType.RECURRING_TRANSACTION;
    const feesInfo = useFeesInfo({ metadata, createdAt });
    const paymentConfirmation = usePaymentConfirmationText({ type, destinationBalance, sourceBalance });

    const driverInfo = useMemo(() => {
        if (isRecurringTransaction && reasonAccount) {
            <DriverInfo name={reasonAccount.name} accountId={reasonAccount.publicId} />;
        }

        if (entity?.data && entity.data.driver) {
            const { name, accountPublicId } = entity.data.driver;

            return <DriverInfo name={name} accountId={accountPublicId} />;
        }

        return null;
    }, [entity?.data, isRecurringTransaction, reasonAccount]);

    return (
        <>
            <span>
                {t('refunded-of')} {paymentConfirmation} <OrderInfo entity={entity} />
            </span>
            {feesInfo && (
                <span>
                    {t('fees')}: {feesInfo}
                </span>
            )}
            {driverInfo}
            <span>{t('refunded-transaction-id', { publicId })}</span>
            {cancellationNotes?.trim() && <NoteInfo note={cancellationNotes} />}
        </>
    );
};
