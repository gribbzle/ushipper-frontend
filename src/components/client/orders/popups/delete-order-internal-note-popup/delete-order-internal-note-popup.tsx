import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Button, Popup } from '@/components/common';
import { useAppDispatch } from '@store';
import { useDeleteOrderInternalNoteMutation } from '@store/api/order-internal-notes-api';
import { deleteInternalNotePopupPropsSelector, ordersActions } from '@store/common';
import { classname, translateByNamespace } from '@utils';

import './delete-order-internal-note-popup.scss';

const cn = classname('delete-order-internal-note-popup');
const t = translateByNamespace('client:order:internal-notes:delete-internal-note-popup');

type Props = {
    onComplete?: (internalNoteId: string) => void;
};

export const DeleteOrderInternalNotePopup = ({ onComplete }: Props) => {
    const dispatch = useAppDispatch();
    const { isVisible, publicOrderId, internalNoteId } = useSelector(deleteInternalNotePopupPropsSelector);
    const [deleteOrderInternalNote] = useDeleteOrderInternalNoteMutation();

    const handleClose = useCallback(() => {
        dispatch(ordersActions.setDeleteInternalNoteModalProps({ isVisible: false, internalNoteId: null, publicOrderId: null }));
    }, [dispatch]);

    const handleDeleteClick = useCallback(() => {
        if (publicOrderId && internalNoteId) {
            deleteOrderInternalNote({ orderId: publicOrderId, internalNoteId })
                .unwrap()
                .then(() => {
                    if (onComplete) {
                        onComplete(internalNoteId);
                    }
                    handleClose();
                    toast.success(t<string>('delete-internal-note-success'));
                })
                .catch(() => {
                    toast.error(t<string>('delete-internal-note-error'));
                });
        }
    }, [deleteOrderInternalNote, handleClose, internalNoteId, onComplete, publicOrderId]);

    const actions = useMemo(
        () => (
            <div className={cn()}>
                <Button view='default' size='small' onClick={handleClose}>
                    {t('cancel-button-label')}
                </Button>
                <Button view='danger' size='small' onClick={handleDeleteClick}>
                    {t('delete-button-label')}
                </Button>
            </div>
        ),
        [handleClose, handleDeleteClick],
    );

    return <Popup isOpen={isVisible} onClose={handleClose} title={t('title')} actions={actions} />;
};
