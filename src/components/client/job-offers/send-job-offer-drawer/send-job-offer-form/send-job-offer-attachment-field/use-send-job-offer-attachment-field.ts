import { useCallback, useState } from 'react';

import { Attachment } from '@/shared';
import { useSendJobOfferDrawer } from '@components';

export const useSendJobOfferAttachmentField = () => {
    const { loadedAttachmentsRef } = useSendJobOfferDrawer();
    const [attachmentToDelete, setAttachmentToDelete] = useState<Attachment | null>(null);

    const handleClose = useCallback(() => setAttachmentToDelete(null), []);

    const deleteAttachment = useCallback(async () => {
        if (attachmentToDelete) {
            const updatedAttachments = loadedAttachmentsRef.current.filter(att => att.publicId !== attachmentToDelete.publicId);

            loadedAttachmentsRef.current = updatedAttachments;

            handleClose();
        }
    }, [attachmentToDelete, handleClose, loadedAttachmentsRef]);

    const openConfirmationModal = useCallback((attachment: Attachment | null) => {
        if (attachment) {
            setAttachmentToDelete(attachment);
        }
    }, []);

    return { openConfirmationModal, deleteAttachment, handleClose, attachmentToDelete, loadedAttachmentsRef };
};
