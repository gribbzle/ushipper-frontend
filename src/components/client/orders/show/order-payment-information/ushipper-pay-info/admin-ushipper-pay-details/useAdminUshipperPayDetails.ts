import { useMemo } from 'react';
import { format } from 'date-fns';

import { useOrder, useOrderFees, useOrderPaymentInformationHelpers } from '@/hooks/order';
import { FundsTransferStatus } from '@/enums/funds-transfer-status';
import { translateByNamespace } from '@utils/i18n';

import { FormattedFee } from './admin-ushipper-pay-details.types';
import { getFormattedFees } from './utils';

const t = translateByNamespace('client:order:payment-information:fields');

export const useAdminUshipperPayDetails = () => {
    const { fundsTransferStatus, fundsTransferredAt, deliveredAt } = useOrder();
    const { usedFees, delayedFees, instantFees } = useOrderFees();
    const { totalAmount, instantTotalPayment, delayedTotalPayment } = useOrderPaymentInformationHelpers();

    const fundsTransferStatusData = useMemo(() => {
        if (!fundsTransferStatus) return null;

        const statusMapping: Partial<Record<FundsTransferStatus, { label: string; date: string | null }>> = {
            [FundsTransferStatus.COMPLETED]: {
                label: t('paid-at'),
                date: deliveredAt ? format(new Date(deliveredAt), 'MMM d, HH:mm') : null,
            },
            [FundsTransferStatus.DAMAGE_CLAIM]: {
                label: t('claim-date'),
                date: fundsTransferredAt ? format(new Date(fundsTransferredAt), 'MMM d, HH:mm') : null,
            },
        };

        return statusMapping[fundsTransferStatus] ?? null;
    }, [fundsTransferredAt, deliveredAt, fundsTransferStatus]);

    const formattedUsedFees = useMemo<FormattedFee[]>(() => getFormattedFees(usedFees ?? [], totalAmount), [usedFees, totalAmount]);
    const formattedDelayedFees = useMemo<FormattedFee[]>(() => getFormattedFees(delayedFees, delayedTotalPayment), [delayedFees, delayedTotalPayment]);
    const formattedInstantFees = useMemo<FormattedFee[]>(() => getFormattedFees(instantFees, instantTotalPayment), [instantFees, instantTotalPayment]);

    return { fundsTransferStatusData, formattedUsedFees, formattedDelayedFees, formattedInstantFees };
};
