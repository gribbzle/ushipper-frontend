import { useCallback } from 'react';

import { AttachmentType } from '@/enums/attachment-types-enum';
import { OrderSortingDirection } from '@/enums/order-sorting-direction';
import { useDownloadAttachment } from '@/hooks/useDownload';
import { Attachment } from '@/shared';
import { useGetOrderAttachmentsQuery } from '@store/api/orders-api';

export const useCDContractAttachment = (publicId?: string) => {
    const { data } = useGetOrderAttachmentsQuery(
        { orderId: publicId, type: AttachmentType.CD_CONTRACT, orderName: 'created_at', orderDirection: OrderSortingDirection.DESC },
        { skip: !publicId },
    );

    const { downloadAttachment } = useDownloadAttachment();

    const uploadCDContractHandler = useCallback(async (file: Attachment) => downloadAttachment(file), [downloadAttachment]);

    return { cdContract: data?.attachments[0] ?? null, uploadCDContractHandler };
};
