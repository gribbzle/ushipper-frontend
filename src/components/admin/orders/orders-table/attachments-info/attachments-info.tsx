import React, { useCallback, useMemo } from 'react';

import { AttachmentItem } from '@/components/common/attachment-item/attachment-item';
import { useHandleViewBol } from '@/hooks/order';
import { Attachment } from '@/shared';
import { fetchOrderBOL } from '@api';
import { AttachmentType, OrderSortingDirection } from '@enums';
import { ImageProvider } from '@/providers/ImageProvider';
import { useAppDispatch } from '@store';
import { useGetOrderAttachmentsQuery } from '@store/api/orders-api';
import { viewersActions } from '@store/common/viewers';
import { FileClipButton } from '@/components/ui/data-display/file-clip-button';
import { getLastVisibleAttachmentOverlayText, SplitAttachmentsResult, splitAttachmentsWithPdfLimit } from '@utils/attachments';
import { classname } from '@utils/classname';
import { isFilePdf } from '@utils/files';
import { isFreightX, isUshipper } from '@utils/project-config';

import { AttachmentsInfoProps } from './attachments-info.types';

import './attachments-info.scss';

const MAX_VISIBLE_COUNT = 3;

const cn = classname('attachments-info');

export const AttachmentsInfo = ({ publicId, type }: AttachmentsInfoProps) => {
    const { data } = useGetOrderAttachmentsQuery(
        { orderId: publicId, type, orderName: 'created_at', orderDirection: OrderSortingDirection.DESC },
        { skip: !publicId },
    );

    const handleViewBolAttachmentClick = useHandleViewBol(publicId);
    const dispatch = useAppDispatch();

    const handleViewBolClick = useCallback(async () => {
        if (publicId) {
            const orderBol = await fetchOrderBOL(publicId);
            const { attachment } = orderBol;

            if (attachment) {
                const { url, name } = attachment;
                const isPdf = isFilePdf(url);

                if (isPdf) {
                    dispatch(
                        viewersActions.setPDFViewerPopup({
                            isOpened: true,
                            url,
                            fileName: name,
                        }),
                    );
                } else {
                    handleViewBolAttachmentClick();
                }
            }
        }
    }, [dispatch, handleViewBolAttachmentClick, publicId]);

    const attachments = useMemo((): Attachment[] => data?.attachments || [], [data?.attachments]);
    const isBol = useMemo((): boolean => type === AttachmentType.BOL, [type]);
    const showViewBolButton = useMemo((): boolean => isUshipper && isBol && !attachments.length, [isBol, attachments]);
    const showEmptyState = useMemo((): boolean => !attachments.length && (!isBol || isFreightX), [isBol, attachments]);

    const { pdfFiles, visibleOtherFiles, hiddenOtherFiles, hiddenCount } = useMemo(
        (): SplitAttachmentsResult => splitAttachmentsWithPdfLimit(attachments, MAX_VISIBLE_COUNT - Number(showViewBolButton)),
        [attachments, showViewBolButton],
    );

    if (showEmptyState) {
        return <>—</>;
    }

    return (
        <div className={cn()}>
            {showViewBolButton && <FileClipButton onClick={handleViewBolClick} />}{' '}
            {pdfFiles.map(attachment => (
                <AttachmentItem key={attachment.publicId} attachment={attachment} />
            ))}
            <ImageProvider>
                {visibleOtherFiles.map((attachment, index) => {
                    const overlayText = getLastVisibleAttachmentOverlayText({ index, hiddenCount, visibleLength: visibleOtherFiles.length });

                    return <AttachmentItem key={attachment.publicId} attachment={attachment} overlayText={overlayText} />;
                })}
                {hiddenOtherFiles.map(attachment => (
                    <AttachmentItem key={attachment.publicId} attachment={attachment} hidden={true} />
                ))}
            </ImageProvider>
        </div>
    );
};
