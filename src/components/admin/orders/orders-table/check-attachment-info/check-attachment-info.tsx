import React, { useCallback } from 'react';

import { ThumbnailImage } from '@/components/common';
import { useInstantPaymentAttachments } from '@/hooks/order';
import { Attachment } from '@/shared';
import { ImageProvider } from '@providers';
import { useAppDispatch } from '@store';
import { viewersActions } from '@store/common/viewers';
import { FileClipButton } from '@ui';
import { classname } from '@utils/classname';
import { convertBytesToMB } from '@utils/converter';
import { isFileImage, isFilePdf } from '@utils/files';

import './check-attachment-info.scss';

const cn = classname('check-attachment-info');

export type CheckAttachmentInfoProps = {
    publicId: string;
};

export const CheckAttachmentInfo = ({ publicId }: CheckAttachmentInfoProps) => {
    const { attachments, uploadPaymentDocumentHandler } = useInstantPaymentAttachments(publicId);
    const dispatch = useAppDispatch();

    const images = attachments.filter(file => isFileImage(file.url));
    const otherFiles = attachments.filter(file => !isFileImage(file.url));

    const showPdfFile = useCallback(
        async (file: Attachment) => {
            dispatch(
                viewersActions.setPDFViewerPopup({
                    isOpened: true,
                    url: file.url,
                    fileName: file.name,
                }),
            );
        },
        [dispatch],
    );

    if (!attachments.length) return <>—</>;

    return (
        <div className={cn('')}>
            {images.length > 0 && (
                <ImageProvider>
                    <div className={cn('', { row: true })}>
                        {images.map(({ publicId, name, url }) => (
                            <ThumbnailImage key={publicId} src={url} name={name} size={40} />
                        ))}
                    </div>
                </ImageProvider>
            )}
            {!!otherFiles.length && (
                <div className={cn('')}>
                    {otherFiles.map(file => {
                        const { publicId, name, size } = file;
                        const isPdf = isFilePdf(name);

                        return (
                            <div
                                key={publicId}
                                className={cn('file', { hover: true })}
                                onClick={() => (isPdf ? showPdfFile(file) : uploadPaymentDocumentHandler(file))}
                            >
                                <FileClipButton onClick={() => null} />
                                <div className={cn('file-details')}>
                                    <span className={cn('file-name')}>{name}</span>
                                    <span className={cn('file-size')}>{convertBytesToMB(size).toString()} MB</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
