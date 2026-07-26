import React, { useCallback } from 'react';

import { ThumbnailImage } from '@/components/common';
import { useDownloadAttachment } from '@/hooks/useDownload';
import { useAppDispatch } from '@store';
import { viewersActions } from '@store/common/viewers';
import { FileClipButton } from '@ui';
import { isFileImage, isFilePdf } from '@utils';

import { AttachmentItemProps } from './attachment-item.types';

export const AttachmentItem = ({ attachment, overlayText, hidden }: AttachmentItemProps) => {
    const { url, name } = attachment || {};
    const dispatch = useAppDispatch();
    const isImage = !!url && isFileImage(url);
    const isPdf = !!url && isFilePdf(url);

    const showPdfFile = useCallback(async () => {
        if (url) {
            dispatch(
                viewersActions.setPDFViewerPopup({
                    isOpened: true,
                    url,
                    fileName: name,
                }),
            );
        }
    }, [dispatch, url, name]);

    const { downloadAttachment } = useDownloadAttachment();

    const uploadPaymentDocumentHandler = useCallback(() => {
        if (attachment) {
            downloadAttachment(attachment);
        }
    }, [downloadAttachment, attachment]);

    if (!url) {
        return <>—</>;
    }

    return isImage ? (
        <ThumbnailImage src={url} name={name} size={40} overlayText={overlayText} hidden={hidden} />
    ) : (
        <FileClipButton onClick={isPdf ? showPdfFile : uploadPaymentDocumentHandler} />
    );
};
