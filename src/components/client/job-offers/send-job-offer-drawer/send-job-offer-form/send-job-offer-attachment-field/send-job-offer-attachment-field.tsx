import React, { useMemo } from 'react';
import { Field } from 'react-final-form';

import { useDownloadAttachment } from '@/hooks/useDownload';
import { Button, Popup } from '@components';
import { FileItem, FileUploaderField } from '@fields';
import { BinIcon } from '@icons';
import { classname, convertBytesToMB, translateByNamespace } from '@utils';

import { useSendJobOfferAttachmentField } from './use-send-job-offer-attachment-field';

import '../send-job-offer-form.scss';

const fuT = translateByNamespace('common:file-uploader');
const tSendJobOffer = translateByNamespace('client:send-job-offer');
const attachmentCn = classname('send-job-offer');

export const SendJobOfferAttachmentField = () => {
    const { downloadAttachment } = useDownloadAttachment();
    const { openConfirmationModal, deleteAttachment, attachmentToDelete, loadedAttachmentsRef, handleClose } = useSendJobOfferAttachmentField();

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='danger' onClick={deleteAttachment}>
                    {fuT('delete')}
                </Button>
                <Button size='small' onClick={handleClose}>
                    {fuT('cancel')}
                </Button>
            </>
        ),
        [handleClose, deleteAttachment],
    );

    return (
        <>
            <Popup
                isOpen={!!attachmentToDelete}
                onClose={handleClose}
                title={fuT('delete-confirmation', { name: attachmentToDelete?.name || '', size: convertBytesToMB(attachmentToDelete?.size || 0).toString() })}
                actions={actions}
            />
            <Field name='attachments' label={tSendJobOffer('form:upload')} component={FileUploaderField} />
            {!!loadedAttachmentsRef.current.length && (
                <aside>
                    {loadedAttachmentsRef.current.map(file => (
                        <FileItem
                            onItemClickCallback={() => downloadAttachment(file)}
                            key={file.publicId}
                            size={file.size}
                            name={file.name}
                            onDelete={() => openConfirmationModal(file)}
                            buttonContent={<BinIcon className={attachmentCn('bin-icon')} />}
                        />
                    ))}
                </aside>
            )}
        </>
    );
};
