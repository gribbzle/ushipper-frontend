import { useMemo } from 'react';

import { FundsTransferStatus } from '@/enums/funds-transfer-status';
import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { OrderStatisticsStatus } from '@/enums/order/order-statistics-status';
import { OrderStatus } from '@/enums/order-status';
import { useIsPartnerCompany } from '@/hooks/authorized-user/use-is-partner-company';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { translateFundsTransferStatus } from '@utils/translate/order/funds-transfer-status-translations';

import { useOrderTotalAmount, useTabValueFromUrl } from '../hooks';

import { DriverPayInfoProps } from './driver-pay-info.types';

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
