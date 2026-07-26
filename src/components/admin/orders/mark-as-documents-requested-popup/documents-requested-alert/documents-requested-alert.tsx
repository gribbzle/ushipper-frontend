import React from 'react';

import { Attachment } from '@/shared';
import { AlertBlock, AttachmentDownloadButton } from '@components';
import { Ellipse } from '@icons';
import { useGetOrderRequestedDocumentsQuery } from '@store/api/orders-api';
import { classname, translateByNamespace } from '@utils';

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
