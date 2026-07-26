import { useMemo } from 'react';

import { FundsTransferStatus, InstantTermPaymentType, OrderStatisticsStatus, OrderStatus } from '@enums';
import { useIsPartnerCompany } from '@hooks';
import { formatToCurrency, translateByNamespace, translateFundsTransferStatus } from '@utils';

import { useOrderTotalAmount, useTabValueFromUrl } from '../hooks';

import { DriverPayInfoProps } from './driver-pay-info';

const t = translateByNamespace('client:orders-page:order-item:driver-alert');
const tCheckApproval = translateByNamespace('common:order');

export const useDriverPayInfo = ({
    status,
    fundsTransferStatus,
    instantTermPaymentType,
    driverFeeCharge,
    driverDelayedPayment,
    paymentInformation,
}: DriverPayInfoProps) => {
    const isPartner = useIsPartnerCompany();
    const { statisticsStatus } = useTabValueFromUrl();
    const { totalAmount } = useOrderTotalAmount({ paymentInformation });

    const showDriverPay = useMemo(
        () => isPartner && statisticsStatus !== OrderStatisticsStatus.NEW && totalAmount > 0 && (driverFeeCharge || driverDelayedPayment),
        [isPartner, statisticsStatus, totalAmount, driverFeeCharge, driverDelayedPayment],
    );

    const driverPayStatusText = useMemo<string | null>(() => {
        if (fundsTransferStatus && status === OrderStatus.DELIVERED) {
            if (instantTermPaymentType === InstantTermPaymentType.RECIPIENT_COMPANY) {
                return tCheckApproval('order-check-approval-status');
            }

            return translateFundsTransferStatus(fundsTransferStatus);
        }

        return null;
    }, [fundsTransferStatus, instantTermPaymentType, status]);

    const isDangerStatus = useMemo<boolean>(
        () => fundsTransferStatus === FundsTransferStatus.DAMAGE_CLAIM || fundsTransferStatus === FundsTransferStatus.DOCUMENTS_REQUESTED,
        [fundsTransferStatus],
    );

    const driverPay = useMemo(() => {
        if (driverFeeCharge?.formatted) {
            return formatToCurrency(totalAmount);
        }

        if (driverDelayedPayment?.formatted) {
            return driverDelayedPayment.formatted;
        }

        return t('no-driver-pay');
    }, [driverFeeCharge, driverDelayedPayment, totalAmount]);

    return { showDriverPay, driverPayStatusText, showDriverPayStatusText: !!driverPayStatusText, isDangerStatus, driverPay };
};
