import { useMemo } from 'react';

import { useOrderPaymentTerms } from '@/hooks/order';
import { FundsTransferStatus, OrderPaymentStatus, OrderStatisticsStatus, OrderStatus, PaymentTerm } from '@enums';
import { useHasPartnerCompanies, useIsPartnerCompany, useMeDriverRelated } from '@hooks';
import { useGetOrderRequestedDocumentsQuery } from '@store/api/orders-api';
import { Load } from '@store/client';

import { useOrderTotalAmount } from './use-order-total-amount';
import { useTabValueFromUrl } from './use-tab-value-from-url';

//TODO rewrite using useOrder and useOrderHelpers
export const useOrderItem = (order: Load) => {
    const { paymentStatus, paidAt, sendInvoiceAt, paymentInformation, fundsTransferStatus, publicId, status } = order;

    const isRequestedDocumentsStatus = useMemo(
        (): boolean =>
            !!fundsTransferStatus && [FundsTransferStatus.DOCUMENTS_REQUESTED, FundsTransferStatus.DOCUMENTS_SUBMITTED].includes(fundsTransferStatus),
        [fundsTransferStatus],
    );

    const { data: requestsDocuments } = useGetOrderRequestedDocumentsQuery({ orderId: publicId }, { skip: !isRequestedDocumentsStatus });

    const { statisticsStatus } = useTabValueFromUrl();
    const isPartner = useIsPartnerCompany();
    const isDriver = useMeDriverRelated();
    const { hasPartnerCompanies } = useHasPartnerCompanies();
    const { isOnlyInstantTermsOrder } = useOrderPaymentTerms({
        terms: paymentInformation?.terms,
        delayedTerms: paymentInformation?.delayedTerms,
    });

    const { totalAmount } = useOrderTotalAmount({ paymentInformation });

    const showInvoiced = useMemo(() => !isPartner && paymentStatus === OrderPaymentStatus.BILLED && !!sendInvoiceAt, [isPartner, paymentStatus, sendInvoiceAt]);
    const showPaymentReceived = useMemo(() => !isPartner && paymentStatus === OrderPaymentStatus.PAID && !!paidAt, [paidAt, paymentStatus, isPartner]);

    const showNoPaymentReceived = useMemo(
        () => !isPartner && (paymentStatus === OrderPaymentStatus.BILLED || paymentStatus === OrderPaymentStatus.NOT_BILLED),
        [paymentStatus, isPartner],
    );

    const showAdditionalDocumentsAlert = useMemo(
        () =>
            isPartner &&
            statisticsStatus === OrderStatisticsStatus.FUNDS_PENDING &&
            totalAmount > 0 &&
            isRequestedDocumentsStatus &&
            !!requestsDocuments?.length,
        [totalAmount, isPartner, statisticsStatus, isRequestedDocumentsStatus, requestsDocuments?.length],
    );

    const showDriverUshipperFeeAlert = useMemo(
        () =>
            isPartner &&
            statisticsStatus === OrderStatisticsStatus.ASSIGNED &&
            totalAmount > 0 &&
            ((paymentInformation.terms && [PaymentTerm.COD, PaymentTerm.COP].includes(paymentInformation.terms)) ||
                (paymentInformation.delayedTerms && [PaymentTerm.COD, PaymentTerm.COP].includes(paymentInformation.delayedTerms))),
        [statisticsStatus, isPartner, totalAmount, paymentInformation],
    );

    const showDriverPaymentFormAlert = useMemo(
        () => status === OrderStatus.DELIVERED && isOnlyInstantTermsOrder && isDriver && hasPartnerCompanies,
        [isOnlyInstantTermsOrder, status, isDriver, hasPartnerCompanies],
    );

    return {
        showNoPaymentReceived,
        showPaymentReceived,
        showInvoiced,
        showDriverUshipperFeeAlert,
        showAdditionalDocumentsAlert,
        showDriverPaymentFormAlert,
        isPartner,
        requestsDocuments,
    };
};
