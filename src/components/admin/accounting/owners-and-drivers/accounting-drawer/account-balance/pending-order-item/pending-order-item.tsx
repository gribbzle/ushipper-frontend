import React, { useMemo } from 'react';
import { format } from 'date-fns';

import { Link } from '@/components/common/link/link';
import { TransactionStatusGroupEnum } from '@/enums/transactions/transaction-status-group-enum';
import { useOrder, usePendingOrderLabel } from '@/hooks/order';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import { TransactionStatusGroupTag } from '../transaction-status-group-tag';

import './pending-order-item.scss';

const cn = classname('pending-order-item');
const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:account-balance');

export const PendingOrderItem = () => {
    const { details, publicId, type, deliveredAt, instantTermPaymentType, fundsTransferStatus, paymentInformation, status } = useOrder();
    const { payment, delayedPayment } = paymentInformation;

    const amount = useMemo(() => {
        const totalAmount = (payment ?? 0) + (delayedPayment ?? 0);
        const formattedAmount = formatToCurrency(totalAmount);

        return totalAmount > 0 ? `+${formattedAmount}` : formattedAmount;
    }, [delayedPayment, payment]);

    const paymentDetails = usePendingOrderLabel({ instantTermPaymentType, fundsTransferStatus, status });

    return (
        <div className={cn()}>
            <div className={cn('details')}>
                <div className={cn('details-column')}>
                    <Link
                        href={{
                            pathname: `/admin/orders/${type}/[order-id]`,
                            query: { ['order-id']: publicId },
                        }}
                        as={`/admin/orders/${type}/${publicId}`}
                    >
                        <span>
                            {t('order-id-label')} {details.orderId ? `#${details.orderId}` : 'None'}
                        </span>
                    </Link>

                    {!!deliveredAt && <span className={cn('details-date')}>{t('delivered-at-label', { date: format(new Date(deliveredAt), 'MMM, dd') })}</span>}
                </div>
            </div>
            <div className={cn('details-column', { left: true })}>
                {amount && <TransactionStatusGroupTag view={TransactionStatusGroupEnum.AWAITING} text={amount} />}
                {paymentDetails && <span className={cn('details-date')}> {paymentDetails}</span>}
            </div>
        </div>
    );
};
