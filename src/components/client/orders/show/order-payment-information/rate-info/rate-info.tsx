import React, { useCallback, useMemo } from 'react';
import { format } from 'date-fns';

import { OrderPaymentInformationDrawer } from '@/components/client/orders/drawers/order-payment-information-drawer/order-payment-information-drawer';
import { IconButton } from '@/components/common/icon-button/icon-button';
import { LabeledText } from '@/components/common/labeled-text/labeled-text';
import { useCanManageOrder, useOrderPaymentTerms } from '@/hooks/order';
import { preparePaymentInformation } from '@/utils/orders';
import { getPaymentMethodTranslate, getPaymentTermTranslate } from '@/utils/payment';
import { useIsPartnerCompany } from '@/hooks/authorized-user/use-is-partner-company';
import { useMeAdmin, useMeCarrier, useMeShipper } from '@/hooks/use-user-role-group';
import { useAppDispatch, useAppSelector } from '@store';
import { ordersActions, orderSelector } from '@store/client';
import { DotLeader } from '@/components/ui/data-display/dot-leader';
import { classname } from '@utils/classname';
import { formatDateWithMonthInWords } from '@utils/dates';
import { translateByNamespace } from '@utils/i18n';
import { formatToCurrency } from '@utils/numbers';

import { BlockWrapper } from '../block-wrapper';

import './rate-info.scss';
import PencilIcon from '@/assets/icons/pencil.svg';

const t = translateByNamespace('client:order:payment-information');
const tFields = translateByNamespace('client:order:payment-information:fields');
const cn = classname('rate-info');

export const RateInformation = () => {
    const dispatch = useAppDispatch();

    const order = useAppSelector(orderSelector);

    const { paymentInformation, sendInvoiceAt, paidAt } = order || {};

    const preparedPaymentInformation = useMemo(() => (paymentInformation ? preparePaymentInformation(paymentInformation) : null), [paymentInformation]);

    const { clientPrice, clientTerms, payment, terms, method, delayedPayment, delayedTerms, delayedMethod, brokerFee, driverPay, notes } =
        preparedPaymentInformation || {};

    const { paidAmount, paidMethod, receiptAt } = order?.payment ?? {};

    const isMeCarrier = useMeCarrier();
    const isMeShipper = useMeShipper();
    const isMeAdmin = useMeAdmin();
    const isPartner = useIsPartnerCompany();
    const { isBothTermsOrder } = useOrderPaymentTerms({ terms, delayedTerms });
    const canPerformActions = useCanManageOrder();

    const termsBlock = useMemo(() => {
        if (!terms) return null;

        return (
            <>
                <DotLeader
                    label={tFields(isBothTermsOrder && (isPartner || isMeAdmin) ? 'instant-amount' : 'amount')}
                    value={payment ? formatToCurrency(payment) : t('empty-value')}
                />
                <DotLeader label={tFields(isBothTermsOrder && (isPartner || isMeAdmin) ? 'instant-terms' : 'terms')} value={getPaymentTermTranslate(terms)} />
                <DotLeader
                    label={tFields(isBothTermsOrder && (isPartner || isMeAdmin) ? 'instant-method' : 'method')}
                    value={method ? getPaymentMethodTranslate(method) : t('empty-value')}
                />
            </>
        );
    }, [terms, payment, method, isBothTermsOrder, isPartner, isMeAdmin]);

    const delayedTermsBlock = useMemo(() => {
        if (!delayedTerms) return null;

        if (isMeAdmin || isPartner) {
            return (
                <>
                    <DotLeader
                        label={tFields(isBothTermsOrder ? 'delayed-amount' : 'amount')}
                        value={delayedPayment ? formatToCurrency(delayedPayment) : t('empty-value')}
                    />
                    <DotLeader label={tFields(isBothTermsOrder ? 'delayed-terms' : 'terms')} value={getPaymentTermTranslate(delayedTerms)} />
                    <DotLeader
                        label={tFields(isBothTermsOrder ? 'delayed-method' : 'method')}
                        value={delayedMethod ? getPaymentMethodTranslate(delayedMethod) : t('empty-value')}
                    />
                </>
            );
        }

        return (
            <>
                <DotLeader
                    label={tFields(isBothTermsOrder ? 'delayed-payment' : 'amount')}
                    value={delayedPayment ? formatToCurrency(delayedPayment) : t('empty-value')}
                />
                <DotLeader label={tFields(isBothTermsOrder ? 'delayed-terms' : 'terms')} value={getPaymentTermTranslate(delayedTerms)} />
                <DotLeader
                    label={tFields(isBothTermsOrder ? 'delayed-method' : 'method')}
                    value={delayedMethod ? getPaymentMethodTranslate(delayedMethod) : t('empty-value')}
                />
            </>
        );
    }, [delayedTerms, isMeAdmin, isBothTermsOrder, isPartner, delayedPayment, delayedMethod]);

    const clientTermsBlock = useMemo(() => {
        if (!isMeShipper) return null;
        if (!clientTerms) return null;

        return (
            <>
                <>
                    <DotLeader label={tFields('client-price')} value={clientPrice ? formatToCurrency(clientPrice) : t('empty-value')} />
                    <DotLeader label={tFields('client-terms')} value={getPaymentTermTranslate(clientTerms)} />
                </>
            </>
        );
    }, [isMeShipper, clientTerms, clientPrice]);

    const paidBlock = useMemo(() => {
        if (isPartner) return null;
        if (isMeAdmin) return null;

        return (
            <>
                {paidAt && <p className={cn('received')}>{t('received', { date: formatDateWithMonthInWords(paidAt) ?? '' })}</p>}
                {paidAmount && <DotLeader label={tFields('paid-amount')} value={formatToCurrency(paidAmount)} />}
                {paidMethod && <DotLeader label={tFields('method')} value={getPaymentMethodTranslate(paidMethod)} />}
            </>
        );
    }, [isMeAdmin, isPartner, paidAt, paidAmount, paidMethod]);

    const body = useMemo(
        () => (
            <>
                {canPerformActions && <OrderPaymentInformationDrawer />}
                {preparedPaymentInformation && (
                    <>
                        {clientTermsBlock}
                        {termsBlock}
                        {delayedTermsBlock}
                        {!!brokerFee && <DotLeader label={tFields('broker-fee')} value={formatToCurrency(brokerFee)} />}
                        {!!driverPay && isMeCarrier && !isPartner && <DotLeader label={tFields('driver-pay')} value={formatToCurrency(driverPay)} />}
                        {notes && <LabeledText label={tFields('notes')} value={notes} />}
                    </>
                )}
                {sendInvoiceAt && <p className={cn('invoiced')}>{t('invoiced', { date: formatDateWithMonthInWords(sendInvoiceAt) ?? '' })}</p>}
                {paidBlock}
                {receiptAt && <DotLeader label={tFields('receipt-date')} value={format(new Date(receiptAt), 'MMM d, HH:mm')} />}
            </>
        ),
        [
            brokerFee,
            canPerformActions,
            clientTermsBlock,
            delayedTermsBlock,
            driverPay,
            isMeCarrier,
            isPartner,
            notes,
            paidBlock,
            preparedPaymentInformation,
            receiptAt,
            sendInvoiceAt,
            termsBlock,
        ],
    );

    const handlePaymentInformationDrawerOpen = useCallback(() => {
        dispatch(ordersActions.setPaymentInformationDrawerProps(Object.assign({ isVisible: true }, paymentInformation)));
    }, [dispatch, paymentInformation]);

    const title = useMemo(
        () => (
            <>
                {t('rate-title')} {canPerformActions && <IconButton Icon={PencilIcon} size='mini' onClick={handlePaymentInformationDrawerOpen} />}
            </>
        ),
        [handlePaymentInformationDrawerOpen, canPerformActions],
    );

    return <BlockWrapper body={body} title={title} />;
};
