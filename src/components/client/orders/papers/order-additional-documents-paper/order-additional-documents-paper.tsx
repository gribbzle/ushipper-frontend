import React, { useMemo } from 'react';

import { FundsTransferStatus } from '@/enums/funds-transfer-status';
import { useHasPartnerCompanies } from '@/hooks/authorized-user/use-has-partner-companies';
import { useMeAdmin } from '@/hooks/use-user-role-group';
import { useAppSelector } from '@store';
import { useGetOrderRequestedDocumentsQuery } from '@store/api/orders-api';
import { orderSelector } from '@store/client';
import { Paper } from '@/components/ui/surfaces/paper';

import { OrderAdditionalDocumentsAlert } from '../../alerts';

export const OrderAdditionalDocumentsPaper = () => {
    const order = useAppSelector(orderSelector);
    const { hasPartnerCompanies } = useHasPartnerCompanies();
    const isAdmin = useMeAdmin();

    const { fundsTransferStatus, publicId, fullPrice } = order || {};

    const isRequestedDocumentsStatus =
        fundsTransferStatus && [FundsTransferStatus.DOCUMENTS_REQUESTED, FundsTransferStatus.DOCUMENTS_SUBMITTED].includes(fundsTransferStatus);

    const { data: requestsDocuments } = useGetOrderRequestedDocumentsQuery(
        {
            orderId: publicId as string,
        },
        { skip: !publicId || !isRequestedDocumentsStatus },
    );

    const shouldRender = useMemo(
        () => (hasPartnerCompanies || isAdmin) && fullPrice && fullPrice > 0 && isRequestedDocumentsStatus && !!requestsDocuments?.length,
        [fullPrice, hasPartnerCompanies, isAdmin, isRequestedDocumentsStatus, requestsDocuments?.length],
    );

    if (!shouldRender || !order) {
        return null;
    }

    return (
        <Paper>
            <OrderAdditionalDocumentsAlert fundsTransferStatus={fundsTransferStatus} orderPublicId={order.publicId} requestsDocuments={requestsDocuments} />
        </Paper>
    );
};
