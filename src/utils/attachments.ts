import { Attachment } from '@/shared/types';

import { isFilePdf } from './files';

export type SplitAttachmentsResult = {
    pdfFiles: Attachment[];
    visibleOtherFiles: Attachment[];
    hiddenOtherFiles: Attachment[];
    hiddenCount: number;
};

export const splitAttachmentsWithPdfLimit = (attachments: Attachment[], maxVisible = 5): SplitAttachmentsResult => {
    const { pdfFiles, otherFiles } = attachments.reduce<{
        pdfFiles: Attachment[];
        otherFiles: Attachment[];
    }>(
        (acc, file) => {
            (isFilePdf(file.url) ? acc.pdfFiles : acc.otherFiles).push(file);

            return acc;
        },
        { pdfFiles: [], otherFiles: [] },
    );

    const availableSlots = Math.max(0, maxVisible - pdfFiles.length);
    const showSingleImageOnly = availableSlots === 0;
    const visibleOtherFiles = otherFiles.slice(0, showSingleImageOnly ? 1 : availableSlots);
    const hiddenOtherFiles = otherFiles.slice(visibleOtherFiles.length);
    const hiddenCount = hiddenOtherFiles.length;

    return {
        pdfFiles,
        visibleOtherFiles,
        hiddenOtherFiles,
        hiddenCount,
    };
};

type LastVisibleAttachmentOverlayTextParams = {
    index: number;
    visibleLength: number;
    hiddenCount: number;
};

export const getLastVisibleAttachmentOverlayText = ({ index, visibleLength, hiddenCount }: LastVisibleAttachmentOverlayTextParams): string | undefined =>
    index === visibleLength - 1 && hiddenCount > 0 ? `+${hiddenCount}` : undefined;
