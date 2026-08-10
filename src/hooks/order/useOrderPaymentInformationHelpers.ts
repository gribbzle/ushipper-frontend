import { useMemo } from 'react';

import { PaymentMethod } from '@/enums/payment-method';
import { calculateTotalPayment } from '@/utils/payment';
import { formatToCurrency } from '@utils/numbers';
import { preparePaymentInformation } from '@utils/orders/prepare-payment-information';

import { usePaymentTerm } from './use-order-payment-terms';
import { useOrder } from './useOrder';
import { useOrderHelpers } from './useOrderHelpers';

export const useOrderPaymentInformationHelpers = () => {
    const { paymentInformation, driverDelayedPayment, driverFeeCharge, price } = useOrder();
    const { isDelayed, isInstant } = usePaymentTerm();
    const { receiptlessOrder } = useOrderHelpers();

    const preparedPaymentInformation = useMemo(() => preparePaymentInformation(paymentInformation), [paymentInformation]);

    const { terms: instantTerms, method: instantMethod, payment: instantPayment, delayedTerms, delayedPayment, brokerFee } = preparedPaymentInformation;

    const totalAmount = useMemo(() => calculateTotalPayment(preparedPaymentInformation), [preparedPaymentInformation]);
    const preparedBrokerFee = useMemo(() => brokerFee ?? 0, [brokerFee]);
    const instantTotalPayment = useMemo(() => (instantPayment ?? 0) - preparedBrokerFee, [instantPayment, preparedBrokerFee]);
    const delayedTotalPayment = useMemo(() => delayedPayment ?? 0, [delayedPayment]);

    const isInstantCashPaymentMethod = useMemo<boolean>(() => instantMethod === PaymentMethod.CASH, [instantMethod]);

    const isInstantTermsOrder = useMemo(() => {
        const isTermsInstant = !!instantTerms && isInstant(instantTerms);
        const isDelayedTermsInstant = !!delayedTerms && isInstant(delayedTerms);

        return isTermsInstant || isDelayedTermsInstant;
    }, [instantTerms, delayedTerms, isInstant]);

    const isDelayedTermsOrder = useMemo(() => {
        const isTermsDelayed = !!instantTerms && isDelayed(instantTerms);
        const isDelayedTermsDelayed = !!delayedTerms && isDelayed(delayedTerms);

        return isTermsDelayed || isDelayedTermsDelayed;
    }, [instantTerms, delayedTerms, isDelayed]);

    const isBothTermsOrder = useMemo(() => isInstantTermsOrder && isDelayedTermsOrder, [isDelayedTermsOrder, isInstantTermsOrder]);
    const isOnlyInstantTermsOrder = useMemo(() => !isBothTermsOrder && isInstantTermsOrder, [isBothTermsOrder, isInstantTermsOrder]);
    const isOnlyDelayedTermsOrder = useMemo(() => !isBothTermsOrder && isDelayedTermsOrder, [isBothTermsOrder, isDelayedTermsOrder]);

    const formattedPrice = useMemo(() => formatToCurrency(price ? price / 100 : 0), [price]);
    const formattedInstantPayment = useMemo(() => formatToCurrency(instantPayment ?? 0), [instantPayment]);
    const formattedDriverDelayedPayment = useMemo(() => driverDelayedPayment?.formatted, [driverDelayedPayment?.formatted]);
    const formattedDriverFeeCharge = useMemo(() => driverFeeCharge?.formatted, [driverFeeCharge?.formatted]);

    const instantOrderDriverPay = useMemo<string>(() => {
        if (formattedDriverDelayedPayment) {
            return formattedDriverDelayedPayment;
        }

        if (receiptlessOrder) {
            return formattedInstantPayment;
        }

        return formatToCurrency((instantPayment ?? 0) - Number(driverFeeCharge?.amount ?? 0) / 100);
    }, [driverFeeCharge?.amount, formattedDriverDelayedPayment, formattedInstantPayment, instantPayment, receiptlessOrder]);

    const delayedOrderDriverPay = useMemo(() => {
        if (driverFeeCharge) {
            return formattedPrice;
        }

        return formattedDriverDelayedPayment;
    }, [formattedDriverDelayedPayment, driverFeeCharge, formattedPrice]);

    const bothOrderDriverPay = useMemo(
        () => formatToCurrency((instantPayment ?? 0) + Number(driverDelayedPayment?.amount ?? 0) / 100),
        [driverDelayedPayment?.amount, instantPayment],
    );

    const driverPay = useMemo(() => {
        if (isOnlyInstantTermsOrder) {
            return instantOrderDriverPay;
        }

        if (isOnlyDelayedTermsOrder) {
            return delayedOrderDriverPay;
        }

        return bothOrderDriverPay;
    }, [isOnlyInstantTermsOrder, isOnlyDelayedTermsOrder, bothOrderDriverPay, instantOrderDriverPay, delayedOrderDriverPay]);

    return {
        isInstantCashPaymentMethod,
        isBothTermsOrder,
        isOnlyInstantTermsOrder,
        isOnlyDelayedTermsOrder,
        isDelayedTermsOrder,
        isInstantTermsOrder,
        preparedPaymentInformation,
        instantPayment,
        delayedPayment,
        instantMethod,
        instantTerms,
        totalAmount,
        preparedBrokerFee,
        instantTotalPayment,
        delayedTotalPayment,
        driverPay,
        instantOrderDriverPay,
        delayedOrderDriverPay,
        bothOrderDriverPay,
        formattedPrice,
        formattedInstantPayment,
        formattedDriverDelayedPayment,
        formattedDriverFeeCharge,
    };
};
