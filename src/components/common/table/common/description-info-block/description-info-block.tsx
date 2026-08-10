import React, { useCallback, useMemo } from 'react';

import { PaymentConfirmationType } from '@/enums/transactions/payment-confirmation-type';
import { useDestinationAccountingNumber } from '@hooks';
import { useAppDispatch } from '@store';
import { accountingActions, Transaction } from '@store/admin';
import { classname } from '@utils/classname';
import { getCompanyTypeTranslate } from '@utils/get-company-type-translate';
import { translateByNamespace } from '@utils/i18n';
import { isFreightX } from '@utils/project-config';
import { isCashOut } from '@utils/transaction/get-is-cash-in-cash-out';

import { DriverInfo } from './driver-info';
import { ExternalInfoBlock } from './external-info';
import { FuelTransactionInfo } from './fuel-transaction-info';
import { useFeesInfo, usePaymentConfirmationText } from './hooks';
import { NoteInfo } from './note-info';
import { OrderInfo } from './order-info';
import { RollbackTransactionInfo } from './rollback-transaction-info';

import './description-info-block.scss';

const t = translateByNamespace('admin:accounting:balance-table');
const tReport = translateByNamespace('admin:accounting:owners-and-drivers:report-popup');

const cn = classname('description-info-block');

export type DescriptionInfoBlockProps = Transaction & {
    showExternalInfo?: boolean;
    showDriverInfo?: boolean;
    showReasonAccount?: boolean;
};

export const DescriptionInfoBlock = ({
    createdAt,
    type: confirmation,
    entity,
    destinationBalance,
    sourceBalance,
    metadata,
    reasonAccount,
    rollbackTransaction,
    cancellationNotes,
    notes,
    externalId,
    externalProvider,
    externalStatus,
    showExternalInfo = false,
    showDriverInfo = false,
    showReasonAccount = false,
}: DescriptionInfoBlockProps) => {
    const { driver } = entity?.data || {};
    const { name: reasonAccountName, publicId: reasonAccountPublicId } = reasonAccount || {};
    const isRecurringTransaction = confirmation === PaymentConfirmationType.RECURRING_TRANSACTION;

    const destinationAccountingNumber = useDestinationAccountingNumber(destinationBalance);
    const dispatch = useAppDispatch();
    const feesInfo = useFeesInfo({ metadata, createdAt });
    const paymentConfirmation = usePaymentConfirmationText({ type: confirmation, destinationBalance, sourceBalance });

    const isCashOutOperation = useMemo(() => isCashOut({ confirmation, destinationType: destinationBalance?.type }), [confirmation, destinationBalance?.type]);

    const driverInfo = useMemo(
        () => (
            <>
                {!isRecurringTransaction && showDriverInfo && !!driver && <DriverInfo name={driver.name} accountId={driver.accountPublicId} />}
                {isRecurringTransaction && showReasonAccount && reasonAccountName && <DriverInfo name={reasonAccountName} accountId={reasonAccountPublicId} />}
            </>
        ),
        [showDriverInfo, showReasonAccount, driver, reasonAccountName, reasonAccountPublicId, isRecurringTransaction],
    );

    const handleOpenReportPopup = useCallback(() => {
        if (sourceBalance) {
            dispatch(
                accountingActions.setReportPopupProps({
                    isPopupOpened: true,
                    name: sourceBalance.accountName ?? getCompanyTypeTranslate('driver'),
                    accountId: sourceBalance.accountId,
                    reportType: 'cashout',
                }),
            );
        }
    }, [dispatch, sourceBalance]);

    const details = useMemo(() => {
        const isRollbackTransaction = confirmation === PaymentConfirmationType.ROLLBACK_TRANSACTION;
        const isFuelCardTransaction = confirmation === PaymentConfirmationType.FUEL_CARD_TRANSACTION;

        if (isRollbackTransaction && rollbackTransaction) {
            return <RollbackTransactionInfo {...rollbackTransaction} />;
        }

        if (isFuelCardTransaction) {
            return <FuelTransactionInfo metadata={metadata} />;
        }

        const note = (cancellationNotes || notes)?.trim();

        return (
            <>
                {isCashOutOperation && destinationAccountingNumber && <span>{t('accounting-number', { number: destinationAccountingNumber })}</span>}
                <span>
                    {feesInfo} <OrderInfo entity={entity} />
                </span>
                {note && <NoteInfo note={note} />}
                {driverInfo}
                {isFreightX && isCashOutOperation && sourceBalance && (
                    <span onClick={handleOpenReportPopup} className={cn('link')}>
                        {tReport('statement-report-receipt-btn')}
                    </span>
                )}
                {showExternalInfo && isCashOutOperation && (
                    <ExternalInfoBlock externalId={externalId} externalProvider={externalProvider} externalStatus={externalStatus} />
                )}
            </>
        );
    }, [
        cancellationNotes,
        confirmation,
        destinationAccountingNumber,
        driverInfo,
        entity,
        externalId,
        externalProvider,
        externalStatus,
        feesInfo,
        handleOpenReportPopup,
        isCashOutOperation,
        metadata,
        notes,
        rollbackTransaction,
        showExternalInfo,
        sourceBalance,
    ]);

    return (
        <div className={cn()}>
            <span>{paymentConfirmation}</span>
            {details}
        </div>
    );
};
