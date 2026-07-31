import React from 'react';

import { useDownloadAttachment } from '@/hooks/useDownload';
import { Attachment } from '@/shared';
import { classname } from '@utils/classname';
import { convertBytesToMB } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

import { Button } from '../button';

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
