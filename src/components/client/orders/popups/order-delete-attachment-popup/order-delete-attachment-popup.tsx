import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { Button, Popup } from '@components';
import { useAppDispatch, useAppSelector } from '@store';
import { useRemoveOrderAttachmentMutation } from '@store/api/orders-api';
import { deleteOrderAttachmentPopupSelector, ordersActions } from '@store/client';
import { classname, convertBytesToMB, translateByNamespace } from '@utils';

import './order-delete-attachment-popup.scss';

const t = translateByNamespace('client:order:delete-order-attachment-popup');
const fuT = translateByNamespace('common:file-uploader');
const cn = classname('order-delete-attachment-popup');

export const OrderDeleteAttachmentPopup = () => {
    const [removeAttachment] = useRemoveOrderAttachmentMutation();

    const dispatch = useAppDispatch();
    const { isVisible, attachmentToDelete, orderPublicId } = useAppSelector(deleteOrderAttachmentPopupSelector);

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setDeleteOrderAttachmentPopupProps({ isVisible: false, attachmentToDelete: null, orderPublicId: null }));
    }, [dispatch]);

    const handleConfirm = useCallback(async () => {
        if (!orderPublicId || !attachmentToDelete) {
            return;
        }

        const { publicId, type } = attachmentToDelete;

        await removeAttachment({ orderId: orderPublicId, attachmentId: publicId, ...(type && { type }) })
            .unwrap()
            .then(() => {
                handleClose();
                toast.success<string>(t('success-notification'));
            })
            .catch(() => {
                toast.error<string>(t('error-notification') as string);
            });
    }, [attachmentToDelete, orderPublicId, removeAttachment, handleClose]);

    const actions = useMemo(
        () => (
            <>
                <Button size='small' view='danger' onClick={handleConfirm}>
                    {fuT('delete')}
                </Button>
                <Button size='small' onClick={handleClose}>
                    {fuT('cancel')}
                </Button>
            </>
        ),
        [handleClose, handleConfirm],
    );

    return (
        <Popup
            className={cn()}
            isOpen={isVisible}
            onClose={handleClose}
            title={fuT('delete-confirmation', { name: attachmentToDelete?.name || '', size: convertBytesToMB(attachmentToDelete?.size || 0).toString() })}
            actions={actions}
        />
    );
};
