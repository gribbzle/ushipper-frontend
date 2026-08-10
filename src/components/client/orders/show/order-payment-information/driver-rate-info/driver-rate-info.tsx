import React, { useMemo } from 'react';

import { useOrderPaymentTerms } from '@/hooks/order';
import { isReceiptlessOrder, preparePaymentInformation } from '@/utils/orders';
import { getPaymentMethodTranslate, getPaymentTermTranslate } from '@/utils/payment';
import {} from '@hooks';
import { useAppSelector } from '@store';
import { orderDriverDelayedPaymentSelector, orderDriverFeeChargeSelector, orderFullPriceSelector, orderPriceSelector, orderSelector } from '@store/client';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { convertCentsToDollars, convertCentsToInteger } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';
import { getProjectOrderPayText } from '@utils/translate/order/get-project-order-pay-text';

import { BlockWrapper } from '../block-wrapper';
import { DriverChargedFeeAlert } from '../driver-charged-fee-alert';
import { DriverPayDotLeader } from '../driver-pay-dot-leader';

const t = translateByNamespace('client:order:payment-information');
const tFields = translateByNamespace('client:order:payment-information:fields');

export const DriverRateInformation = () => {
    const order = useAppSelector(orderSelector);
    const orderFullPrice = useAppSelector(orderFullPriceSelector);
    const orderPrice = useAppSelector(orderPriceSelector);
    const driverDelayedPayment = useAppSelector(orderDriverDelayedPaymentSelector);
    const driverFee = useAppSelector(orderDriverFeeChargeSelector);
    const projectOrderPayText = getProjectOrderPayText();

    const { paymentInformation, instantTermPaymentType, driverFeeCharge } = order || {};
    const preparedPaymentInformation = useMemo(() => (paymentInformation ? preparePaymentInformation(paymentInformation) : null), [paymentInformation]);

    const { payment, terms, method, delayedTerms } = preparedPaymentInformation || {};
    const { isBothTermsOrder, isInstantTermsOrder, isDelayedTermsOrder } = useOrderPaymentTerms({ terms, delayedTerms });
    const receiptlessOrder = isReceiptlessOrder(instantTermPaymentType);

    const price = useMemo(() => {
        const orderPriceCents = convertCentsToInteger(orderPrice);

        if (receiptlessOrder) {
            return convertCentsToDollars(orderPriceCents);
        }

        const driverFeeChargeCents = convertCentsToInteger(driverFeeCharge?.amount);

        return convertCentsToDollars(orderPriceCents - driverFeeChargeCents);
    }, [orderPrice, receiptlessOrder, driverFeeCharge?.amount]);

    const onlyInstantTermsBlock = useMemo(() => {
        if (!terms) return null;

        return (
            <>
                {orderFullPrice && <DotLeader label={tFields('amount')} value={formatToCurrency(orderFullPrice / 100)} />}
                <DriverPayDotLeader driverPay={formatToCurrency(price)} driverPaymentTerm='instant' />
                <DotLeader label={tFields('terms')} value={getPaymentTermTranslate(terms)} />
                <DotLeader label={tFields('method')} value={method ? getPaymentMethodTranslate(method) : t('empty-value')} />
            </>
        );
    }, [terms, method, price, orderFullPrice]);

    const delayedTermsBlock = useMemo(() => {
        if (!delayedTerms) return null;

        return (
            <>
                {orderFullPrice && <DotLeader label={tFields('amount')} value={formatToCurrency(orderFullPrice / 100)} />}
                <DriverPayDotLeader driverPay={formatToCurrency(price)} driverPaymentTerm='delayed' />
                <DotLeader label={tFields('terms')} value={projectOrderPayText} />
            </>
        );
    }, [delayedTerms, orderFullPrice, price, projectOrderPayText]);

    const bothTermsBlock = useMemo(() => {
        return (
            <>
                <>
                    {orderFullPrice && <DotLeader label={tFields('amount')} value={formatToCurrency(orderFullPrice / 100)} />}
                    {terms && (
                        <>
                            <DotLeader label={tFields('driver-instant-payment')} value={payment ? formatToCurrency(payment) : t('empty-value')} />
                            <DotLeader label={tFields('driver-instant-terms')} value={getPaymentTermTranslate(terms)} />
                            <DotLeader label={tFields('driver-instant-method')} value={method ? getPaymentMethodTranslate(method) : t('empty-value')} />
                        </>
                    )}
                    <DriverPayDotLeader driverPay={driverDelayedPayment?.formatted} label={tFields('driver-delayed-payment')} driverPaymentTerm='delayed' />
                    <DotLeader label={tFields('driver-delayed-terms')} value={projectOrderPayText} />
                </>
            </>
        );
    }, [orderFullPrice, terms, payment, method, driverDelayedPayment, projectOrderPayText]);

    const body = useMemo(
        () => (
            <>
                {preparedPaymentInformation && (
                    <>
                        {isBothTermsOrder && bothTermsBlock}
                        {!isBothTermsOrder && (
                            <>
                                {isInstantTermsOrder && onlyInstantTermsBlock}
                                {isDelayedTermsOrder && delayedTermsBlock}
                            </>
                        )}
                        {(isBothTermsOrder || isInstantTermsOrder) && receiptlessOrder && (
                            <DriverChargedFeeAlert orderStatus={order?.status} fee={driverFee?.formatted} />
                        )}
                    </>
                )}
            </>
        ),
        [
            receiptlessOrder,
            preparedPaymentInformation,
            isBothTermsOrder,
            bothTermsBlock,
            isInstantTermsOrder,
            onlyInstantTermsBlock,
            isDelayedTermsOrder,
            delayedTermsBlock,
            order?.status,
            driverFee?.formatted,
        ],
    );

    return <BlockWrapper body={body} title={t('rate-title')} />;
};
