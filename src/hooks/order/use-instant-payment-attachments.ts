import { useCallback, useEffect, useMemo, useState } from 'react';

import { AttachmentType, OrderSortingDirection } from '@/enums';
import { useDownloadAttachment } from '@/hooks/useDownload';
import { Attachment } from '@/shared';
import { useGetOrderAttachmentsQuery } from '@store/api/orders-api';

export const useInstantPaymentAttachments = (publicId?: string) => {
    const { data } = useGetOrderAttachmentsQuery(
        { orderId: publicId, type: AttachmentType.INSTANT_PAYMENT_DOCUMENT, orderName: 'created_at', orderDirection: OrderSortingDirection.DESC },
        { skip: !publicId },
    );

    const { downloadAttachment } = useDownloadAttachment();

    const uploadPaymentDocumentHandler = useCallback(async (file: Attachment) => downloadAttachment(file), [downloadAttachment]);

    const [latestPaymentDocument, setLatestPaymentDocument] = useState<Attachment | null>(null);

    const attachments = useMemo(() => data?.attachments ?? [], [data?.attachments]);

    useEffect(() => {
        if (!attachments.length) {
            setLatestPaymentDocument(null);

            return;
        }

        setLatestPaymentDocument(attachments?.[0]);
    }, [attachments]);

    return { attachments, latestPaymentDocument, uploadPaymentDocumentHandler };
};
