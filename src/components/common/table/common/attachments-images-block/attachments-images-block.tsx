import React, { useMemo } from 'react';

import { useInstantPaymentAttachments } from '@/hooks/order';
import { ThumbnailImage } from '@components';
import { ImageProvider } from '@providers';
import { FileClipButton } from '@ui';
import { classname, getLastVisibleAttachmentOverlayText, SplitAttachmentsResult, splitAttachmentsWithPdfLimit, translateByNamespace } from '@utils';

import './attachments-images-block.scss';

const MAX_VISIBLE_IMAGES = 4;

const cn = classname('attachments-images-block');
const tTable = translateByNamespace('admin:orders-page:table-columns-title');

export const AttachmentsImagesBlock = ({ publicId }: { publicId: string }) => {
    const { attachments, uploadPaymentDocumentHandler } = useInstantPaymentAttachments(publicId);

    const { pdfFiles, visibleOtherFiles, hiddenOtherFiles, hiddenCount } = useMemo(
        (): SplitAttachmentsResult => splitAttachmentsWithPdfLimit(attachments, MAX_VISIBLE_IMAGES),
        [attachments],
    );

    if (!attachments.length) {
        return null;
    }

    return (
        <div className={cn('')}>
            {tTable('receipt-photo')}:
            <div className={cn('list')}>
                {pdfFiles.map(file => (
                    <FileClipButton key={file.publicId} size='small' onClick={() => uploadPaymentDocumentHandler(file)} />
                ))}
                <ImageProvider>
                    {visibleOtherFiles.map(({ publicId, url, name }, index) => {
                        const overlayText = getLastVisibleAttachmentOverlayText({ index, hiddenCount, visibleLength: visibleOtherFiles.length });

                        return <ThumbnailImage key={publicId} src={url} name={name} overlayText={overlayText} />;
                    })}
                    {hiddenOtherFiles.map(({ publicId, url, name }) => (
                        <ThumbnailImage key={publicId} src={url} name={name} hidden={true} />
                    ))}
                </ImageProvider>
            </div>
        </div>
    );
};
