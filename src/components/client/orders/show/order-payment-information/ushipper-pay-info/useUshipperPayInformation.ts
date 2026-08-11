import { useMemo } from 'react';

import { useOrder } from '@/hooks/order/useOrder';
import { useOrderHelpers } from '@/hooks/order/useOrderHelpers';
import { useOrderPaymentInformationHelpers } from '@/hooks/order/useOrderPaymentInformationHelpers';
import { getProjectOrderPayText } from '@utils/translate/order/get-project-order-pay-text';

export const useUshipperPayInformation = () => {
    const { driverFeeCharge, driverDelayedPayment } = useOrder();
    const { receiptlessOrder } = useOrderHelpers();

    const {
        isDelayedTermsOrder,
        isInstantTermsOrder,
        isBothTermsOrder,
        preparedPaymentInformation,
        instantOrderDriverPay,
        delayedOrderDriverPay,
        bothOrderDriverPay,
    } = useOrderPaymentInformationHelpers();

    const { isDanger, driverPay } = useMemo(() => {
        if (!preparedPaymentInformation)
            return {
                isDanger: false,
                driverPay: null,
            };

        if (isBothTermsOrder) {
            return {
                isDanger: false,
                driverPay: bothOrderDriverPay,
            };
        }

        if (isInstantTermsOrder) {
            if (driverDelayedPayment) {
                return {
                    isDanger: true,
                    driverPay: instantOrderDriverPay,
                };
            }

            if (receiptlessOrder) {
                return {
                    isDanger: false,
                    driverPay: instantOrderDriverPay,
                };
            }

            return {
                isDanger: false,
                driverPay: instantOrderDriverPay,
            };
        }

        if (isDelayedTermsOrder) {
            if (driverFeeCharge) {
                return {
                    isDanger: true,
                    driverPay: delayedOrderDriverPay,
                };
            }

            return {
                isDanger: false,
                driverPay: delayedOrderDriverPay,
            };
        }

        return { isDanger: false, driverPay: null };
    }, [
        preparedPaymentInformation,
        isBothTermsOrder,
        isInstantTermsOrder,
        isDelayedTermsOrder,
        bothOrderDriverPay,
        driverDelayedPayment,
        receiptlessOrder,
        instantOrderDriverPay,
        driverFeeCharge,
        delayedOrderDriverPay,
    ]);

    const projectOrderPayText = useMemo(() => getProjectOrderPayText(), []);

    return {
        isDanger,
        driverPay,
        projectOrderPayText,
        driverDelayedPayment: driverDelayedPayment?.formatted,
        driverInstantPayment: preparedPaymentInformation?.payment,
    };
};
