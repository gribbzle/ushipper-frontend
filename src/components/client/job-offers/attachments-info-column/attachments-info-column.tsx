import React from 'react';

import { OrderItemInfoColumn } from '@/components/client/orders/order-item-info-column/order-item-info-column';
import { useDownloadAttachment } from '@/hooks/useDownload';
import { Attachment } from '@/shared';
import { FileIcon } from '@icons';
import { classname } from '@utils/classname';
import { convertBytesToMB } from '@utils/converter';
import { translateByNamespace } from '@utils/i18n';

import { FileProps } from './attachments-info-column.types';

import './attachments-info-column.scss';

const cn = classname('attachments-info');
const t = translateByNamespace('client:job-offers-page.job-offer.attachments');
const tFile = translateByNamespace('common:file-uploader');

export const File = ({ name, size, onItemClickCallback }: FileProps) => (
    <div className={cn('file')} onClick={onItemClickCallback}>
        <FileIcon />
        <span>{tFile('file-label', { name, size: convertBytesToMB(size).toString() })}</span>
    </div>
);

export const AttachmentsInfoColumn = ({ files }: { files: Attachment[] }) => {
    const { downloadAttachment } = useDownloadAttachment();

    return (
        <OrderItemInfoColumn title={t('title')} className={cn()}>
            <div className={cn('list')}>
                {files.map(file => (
                    <File key={file.publicId} size={file.size} name={file.name} onItemClickCallback={() => downloadAttachment(file)} />
                ))}
            </div>
        </OrderItemInfoColumn>
    );
};
