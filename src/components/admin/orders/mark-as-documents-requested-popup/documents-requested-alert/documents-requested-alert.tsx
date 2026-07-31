import React from 'react';

import { AlertBlock } from '@/components/common/alert-block/alert-block';
import { AttachmentDownloadButton } from '@/components/common/attachment-download-button/attachment-download-button';
import { Attachment } from '@/shared';
import { Ellipse } from '@icons';
import { useGetOrderRequestedDocumentsQuery } from '@store/api/orders-api';
import { classname } from '@utils/classname';
import { translateByNamespace } from '@utils/i18n';

import './documents-requested-alert.scss';

type DocumentItemProp = {
    label: string;
    attachment: Attachment | null;
};

const t = translateByNamespace('admin:orders-page:mark-as-documents-requested-popup:alert');
const cn = classname('documents-requested-alert');

const DocumentItem = ({ label, attachment }: DocumentItemProp) => (
    <div className={cn('item')}>
        <Ellipse />
        {label}
        {attachment && <AttachmentDownloadButton attachment={attachment} />}
    </div>
);

type DocumentsRequestedAlertProps = {
    orderPublicId: string;
};

export const DocumentsRequestedAlert = ({ orderPublicId }: DocumentsRequestedAlertProps) => {
    const { data: documents } = useGetOrderRequestedDocumentsQuery({ orderId: orderPublicId });

    if (!documents?.length) {
        return null;
    }

    return (
        <AlertBlock>
            <div className={cn()}>
                <h4>{t('title')}</h4>
                {documents.map(doc => (
                    <DocumentItem key={doc.id} label={doc.title} attachment={doc.attachment} />
                ))}
            </div>
        </AlertBlock>
    );
};
