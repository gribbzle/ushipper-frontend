import React, { useMemo } from 'react';
import { format } from 'date-fns';

import { Link } from '@/components/common/link/link';
import { PaymentConfirmationType, TransactionStatusGroupEnum } from '@/enums';
import { useDestinationAccountingNumber } from '@hooks';
import { Transaction, TransactionBalanceResource } from '@store/admin';
import { classname } from '@utils/classname';
import { getPaymentConfirmationTypeTranslate } from '@utils/get-payment-confirmation-type-translate';
import { translateByNamespace } from '@utils/i18n';
import { formatUsedFees } from '@utils/transaction/format-used-fees';
import { isCashIn, isCashOut } from '@utils/transaction/get-is-cash-in-cash-out';

import { TransactionStatusGroupTag } from '../transaction-status-group-tag';

import './transaction-item.scss';

const cn = classname('transaction-item');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:account-balance');
const tAccountingNumber = translateByNamespace('admin:accounting:balance-table');

const getWalletName = (balance: TransactionBalanceResource | null) => (balance?.name ? balance?.name : t('no-details-wallet'));

const getDescription = (key: string, walletName: string, notes?: string | null) => {
    const transactionMap: Record<string, () => string> = {
        cashIn: () => (notes ? t('cash-in-from-label', { walletName, notes }) : t('short-cash-in-from-label', { walletName })),
        cashOut: () => (notes ? t('cash-out-to-label', { walletName, notes }) : t('short-cash-out-to-label', { walletName })),
        transactionFrom: () => (notes ? t('transaction-from-label', { walletName, notes }) : t('short-transaction-from-label', { walletName })),
        transactionTo: () => (notes ? t('transaction-to-label', { walletName, notes }) : t('short-transaction-to-label', { walletName })),
    };

    return transactionMap[key]();
};

type TransactionItemProps = {
    info: Transaction;
    showTransactionType?: boolean;
};

export const TransactionItem = ({ info, showTransactionType = false }: TransactionItemProps) => {
    const { type, amount, statusGroup, createdAt, entity, destinationBalance, sourceBalance, notes, metadata } = info;
    const { data: order } = entity || {};

    const isPositive = parseInt(amount.amount) > 0;

    const walletName = useMemo(
        () => (isPositive ? getWalletName(sourceBalance) : getWalletName(destinationBalance)),
        [isPositive, destinationBalance, sourceBalance],
    );
    const isCashOutOperation = useMemo(() => isCashOut({ confirmation: type, destinationType: destinationBalance?.type }), [type, destinationBalance?.type]);
    const isCashInOperation = useMemo(() => isCashIn({ confirmation: type, sourceType: sourceBalance?.type }), [type, sourceBalance?.type]);

    const description = useMemo<string | null>(() => {
        const text = notes ?? getPaymentConfirmationTypeTranslate(type);

        if (type === PaymentConfirmationType.RECURRING_TRANSACTION) {
            return metadata ? null : getPaymentConfirmationTypeTranslate(type);
        }

        if ((!isPositive && !destinationBalance) || (isPositive && !sourceBalance)) {
            return t('no-details-label', { notes: text });
        }

        if (isPositive) {
            return isCashInOperation ? getDescription('cashIn', walletName, notes) : getPaymentConfirmationTypeTranslate(type);
        }

        return isCashOutOperation ? getDescription('cashOut', walletName, notes) : getPaymentConfirmationTypeTranslate(type);
    }, [type, isPositive, sourceBalance, destinationBalance, notes, metadata, isCashInOperation, isCashOutOperation, walletName]);

    const view = useMemo(
        () => (statusGroup === TransactionStatusGroupEnum.COMPLETED && !isPositive ? TransactionStatusGroupEnum.CANCELLED : statusGroup),
        [statusGroup, isPositive],
    );

    const feesInfo = useMemo(() => {
        const { usedFees } = metadata || {};

        return formatUsedFees(usedFees ?? []);
    }, [metadata]);

    const manualTransactionDetails = useMemo(() => {
        if (isCashInOperation || isCashOutOperation) return null;

        if (type === PaymentConfirmationType.MANUAL_TRANSACTION) {
            const transactionType = isPositive ? 'transactionFrom' : 'transactionTo';

            return getDescription(transactionType, walletName, notes);
        }

        return null;
    }, [isPositive, type, walletName, notes, isCashInOperation, isCashOutOperation]);

    const destinationAccountingNumber = useDestinationAccountingNumber(destinationBalance);

    return (
        <div className={cn()}>
            <div className={cn('details')}>
                {order ? (
                    <Link
                        href={{
                            pathname: `/admin/orders/${order.type}/[order-id]`,
                            query: { ['order-id']: order.publicId },
                        }}
                    >
                        <span>
                            {t('order-id-label')} {order.orderId ? `#${order.orderId}` : 'None'}
                        </span>
                    </Link>
                ) : (
                    <span className={cn('description')}>{description}</span>
                )}
                {!isPositive && destinationAccountingNumber && (
                    <span className={cn('description', { small: true })}>
                        {tAccountingNumber('accounting-number', { number: destinationAccountingNumber })}
                    </span>
                )}
                {manualTransactionDetails && <span className={cn('description', { small: true })}>{manualTransactionDetails}</span>}
                {feesInfo && <span className={cn('description', { small: !!order })}>{feesInfo}</span>}
                <span className={cn('date')}>{format(new Date(createdAt), 'MMMM, dd')}</span>
            </div>
            <div className={cn('details', { left: true })}>
                <TransactionStatusGroupTag view={view} text={`${isPositive ? '+' : ''}${amount.formatted}`} />
                {showTransactionType && type !== PaymentConfirmationType.FUEL_CARD_TRANSACTION && (
                    <span className={cn('date')}>{getPaymentConfirmationTypeTranslate(type)}</span>
                )}
            </div>
        </div>
    );
};
