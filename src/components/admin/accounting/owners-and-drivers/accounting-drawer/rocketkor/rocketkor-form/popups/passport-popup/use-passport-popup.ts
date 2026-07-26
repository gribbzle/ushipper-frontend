import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, rocketkorDocumentsPopupsPropsSelector } from '@store/admin';

import { useSaveDocument } from '../use-save-document';

export const usePassportPopup = () => {
    const dispatch = useAppDispatch();
    const { isPassportPopupOpened: isOpened } = useAppSelector(rocketkorDocumentsPopupsPropsSelector);
    const handleSave = useSaveDocument('passport');

    const handleClose = useCallback(() => {
        dispatch(accountingActions.setRocketkorDocumentPopupProps({ isPassportPopupOpened: false, editDocument: null }));
    }, [dispatch]);

    return {
        isOpened,
        handleSave,
        handleClose,
    };
};
