import { useMemo } from 'react';

import { OrderStatus } from '@/enums';
import { Load } from '@store/client';
import { translateByNamespace } from '@utils/i18n';
import { getOrderCheckStatuses } from '@utils/orders/order-payment-helpers';
import { getAwaitingDeliveryLabel, translateFundsTransferStatus } from '@utils/translate/order/funds-transfer-status-translations';

const t = translateByNamespace('common:order');

type Props = Pick<Load, 'instantTermPaymentType' | 'fundsTransferStatus' | 'status'>;

export const usePendingOrderLabel = ({ instantTermPaymentType, fundsTransferStatus, status }: Props) => {
    const { isCheckApproval, isCheckDeclined } = getOrderCheckStatuses(instantTermPaymentType);

    return useMemo<string | null>(() => {
        switch (true) {
            case status !== OrderStatus.DELIVERED:
                return getAwaitingDeliveryLabel();

            case isCheckApproval:
                return t('order-check-approval-status');

            case isCheckDeclined:
                return t('check-declined');

            default:
                return fundsTransferStatus ? translateFundsTransferStatus(fundsTransferStatus) : null;
        }
    }, [fundsTransferStatus, status, isCheckApproval, isCheckDeclined]);
};
