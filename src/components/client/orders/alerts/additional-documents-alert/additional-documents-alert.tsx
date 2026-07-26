import React from 'react';
import { Field, Form } from 'react-final-form';

import { FundsTransferStatus } from '@/enums';
import { AlertBlock, AttachmentDownloadButton, Button } from '@components';
import { MultiFileUploader } from '@fields';
import { Ellipse } from '@icons';
import { classname, removeFieldPrefix, translateByNamespace } from '@utils';

import { AdditionalDocumentsAlertProps, AdditionalDocumentsAlertRowPropsRowProps, AdditionalDocumentsFormValues } from './additional-documents-alert.types';
import { useAdditionalDocumentsAlert } from './use-additional-documents-alert';

import './additional-documents-alert.scss';

const t = translateByNamespace('client:orders-page:additional-documents-alert');
const cn = classname('additional-documents-alert');

const AdditionalDocumentsAlertRowPropsRow = ({ name, label, attachment, showFileUploader }: AdditionalDocumentsAlertRowPropsRowProps) => (
    <div className={cn('row')}>
        <Ellipse width={4} height={4} />
        {label}
        {attachment && <AttachmentDownloadButton attachment={attachment} />}
        {!attachment && showFileUploader && <Field name={`field_${name}`} className={cn('receipt-file')} component={MultiFileUploader} isMultiFiles={false} />}
    </div>
);

export const OrderAdditionalDocumentsAlert = ({ fundsTransferStatus, orderPublicId, requestsDocuments = [] }: AdditionalDocumentsAlertProps) => {
    const { onSubmit, isRequestingDocuments, isLoading } = useAdditionalDocumentsAlert({
        orderPublicId,
        fundsTransferStatus,
        requestsDocuments,
    });

    return (
        <AlertBlock className={cn()} view={`${isRequestingDocuments ? 'danger' : 'warning'}`}>
            <div className={cn('body')}>
                {t(`${isRequestingDocuments ? 'no-documents-text' : 'add-documents-text'}`)}

                <Form<AdditionalDocumentsFormValues>
                    onSubmit={onSubmit}
                    render={({ handleSubmit, values }) => {
                        const renamedFields = removeFieldPrefix(values);
                        const hasFiles = requestsDocuments.every(doc => renamedFields[doc.title]?.length || doc.attachment);

                        return (
                            <form className={cn('form')} onSubmit={handleSubmit}>
                                {requestsDocuments.map(doc => (
                                    <AdditionalDocumentsAlertRowPropsRow
                                        key={doc.id}
                                        name={doc.title}
                                        label={doc.title}
                                        attachment={doc.attachment}
                                        showFileUploader={fundsTransferStatus === FundsTransferStatus.DOCUMENTS_REQUESTED}
                                    />
                                ))}

                                {isRequestingDocuments && (
                                    <Button view='primary' type='submit' size='small' hasLoader={isLoading} disabled={!hasFiles}>
                                        {t('send-to-review-btn')}
                                    </Button>
                                )}
                            </form>
                        );
                    }}
                />
            </div>
        </AlertBlock>
    );
};
