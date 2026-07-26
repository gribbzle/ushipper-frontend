import React from 'react';

import { useDownloadAttachment } from '@/hooks/useDownload';
import { Attachment } from '@/shared';
import { Button } from '@components';
import { classname, convertBytesToMB, translateByNamespace } from '@utils';

import './attachment-download-button.scss';

type AttachmentDownloadButtonProps = {
    attachment: Attachment;
};

const t = translateByNamespace('common:file-uploader');
const cn = classname('attachment-download-button');

export const AttachmentDownloadButton = ({ attachment }: AttachmentDownloadButtonProps) => {
    const { downloadAttachment } = useDownloadAttachment();

    return (
        <Button size='small' className={cn('')} onClick={() => downloadAttachment(attachment)}>
            <span className={cn('label')}>
                {t('file-label', {
                    name: attachment.name,
                    size: convertBytesToMB(attachment.size).toString(),
                })}
            </span>
        </Button>
    );
};
