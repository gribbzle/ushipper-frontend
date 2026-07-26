import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, rocketkorDocumentsPopupsPropsSelector } from '@store/admin';

import { useSaveDocument } from '../use-save-document';

export const useOwnershipDocumentPopup = () => {
    const dispatch = useAppDispatch();
    const { isOwnershipDocumentPopupOpened: isOpened } = useAppSelector(rocketkorDocumentsPopupsPropsSelector);
    const handleSave = useSaveDocument('ownership_document');

    const handleClose = useCallback(() => {
        dispatch(accountingActions.setRocketkorDocumentPopupProps({ isOwnershipDocumentPopupOpened: false, editDocument: null }));
    }, [dispatch]);

    return {
        isOpened,
        handleSave,
        handleClose,
    };
};
