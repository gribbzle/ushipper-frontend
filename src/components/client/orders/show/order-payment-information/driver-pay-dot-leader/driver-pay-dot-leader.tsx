import React, { useMemo } from 'react';

import { FundsTransferStatus, OrderStatus } from '@/enums';
import { useAppSelector } from '@store';
import { useGetOrderRequestedDocumentsQuery } from '@store/api/orders-api';
import { orderSelector } from '@store/client';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';
import { isOrderCheckApproval } from '@utils/orders/order-payment-helpers';
import {
    getAwaitingDeliveryLabel,
    translateFundsTransferStatus,
    translateShortFundsTransferStatus,
} from '@utils/translate/order/funds-transfer-status-translations';

import './driver-pay-dot-leader.scss';

type DriverPayDotLeaderProps = {
    driverPay?: string | null;
    label?: string;
    isDangerStyle?: boolean;
    driverPaymentTerm: 'instant' | 'delayed';
};

const t = translateByNamespace('client:order:payment-information');
const tStatus = translateByNamespace('common:order');

const cn = classname('driver-pay-dot-leader');

export const DriverPayDotLeader = ({ driverPay, label, isDangerStyle = false, driverPaymentTerm }: DriverPayDotLeaderProps) => {
    const order = useAppSelector(orderSelector);

    const { publicId, fundsTransferStatus, status, instantTermPaymentType } = order || {};
    const isInstantDriverPaymentTerm = driverPaymentTerm === 'instant';
    const isCheckApprovalPending = isOrderCheckApproval(instantTermPaymentType);

    const isRequestedDocumentsStatus =
        fundsTransferStatus && [FundsTransferStatus.DOCUMENTS_REQUESTED, FundsTransferStatus.DOCUMENTS_SUBMITTED].includes(fundsTransferStatus);

    const { data: requestsDocuments } = useGetOrderRequestedDocumentsQuery({ orderId: publicId }, { skip: !isRequestedDocumentsStatus });

    const driverPayStatusText = useMemo<string | null>(() => {
        if (fundsTransferStatus) {
            if (fundsTransferStatus === FundsTransferStatus.DAMAGE_CLAIM) {
                return translateShortFundsTransferStatus(fundsTransferStatus);
            }

            if (status !== OrderStatus.DELIVERED) {
                return getAwaitingDeliveryLabel();
            }

            if (isCheckApprovalPending) {
                return tStatus('order-check-approval-status');
            }

            if (isInstantDriverPaymentTerm && status === OrderStatus.DELIVERED) {
                return translateFundsTransferStatus(FundsTransferStatus.COMPLETED);
            }

            return translateFundsTransferStatus(fundsTransferStatus);
        }

        return null;
    }, [fundsTransferStatus, status, isInstantDriverPaymentTerm, isCheckApprovalPending]);

    const isDangerStatus = useMemo<boolean>(
        () =>
            !!driverPay &&
            (fundsTransferStatus === FundsTransferStatus.DAMAGE_CLAIM ||
                (!!requestsDocuments?.length && fundsTransferStatus === FundsTransferStatus.DOCUMENTS_REQUESTED)),
        [fundsTransferStatus, requestsDocuments, driverPay],
    );

    const isAwaitingStatus = useMemo<boolean>(
        () =>
            !!driverPay &&
            (isCheckApprovalPending ||
                fundsTransferStatus === FundsTransferStatus.INITIATED ||
                fundsTransferStatus === FundsTransferStatus.NONE ||
                status !== OrderStatus.DELIVERED),
        [driverPay, status, fundsTransferStatus, isCheckApprovalPending],
    );

    const showDriverPayStatusText = useMemo<boolean>(() => {
        if (fundsTransferStatus === FundsTransferStatus.DOCUMENTS_REQUESTED) {
            return !!driverPayStatusText && !!requestsDocuments?.length;
        }

        return !!driverPayStatusText;
    }, [driverPayStatusText, fundsTransferStatus, requestsDocuments?.length]);

    const formattedDriverPay = useMemo(() => {
        if (!driverPay) {
            return t('empty-value');
        }

        return showDriverPayStatusText ? `${driverPay} (${driverPayStatusText})` : driverPay;
    }, [driverPay, showDriverPayStatusText, driverPayStatusText]);

    return (
        <DotLeader
            label={label ?? t('fields.driver-pay')}
            value={formattedDriverPay}
            className={cn('', {
                success: !!driverPay && !isCheckApprovalPending && fundsTransferStatus === FundsTransferStatus.COMPLETED,
                danger: isDangerStyle || isDangerStatus,
                awaiting: isAwaitingStatus,
            })}
        />
    );
};
