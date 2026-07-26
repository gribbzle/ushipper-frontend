import { useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '@store';
import { accountingActions, rocketkorDocumentsPopupsPropsSelector } from '@store/admin';

import { useSaveDocument } from '../use-save-document';

export const useTaxDocumentPopup = () => {
    const dispatch = useAppDispatch();
    const handleSave = useSaveDocument('tax_document');
    const { isTaxDocumentPopupOpened: isOpened } = useAppSelector(rocketkorDocumentsPopupsPropsSelector);

    const handleClose = useCallback(() => {
        dispatch(accountingActions.setRocketkorDocumentPopupProps({ isTaxDocumentPopupOpened: false, editDocument: null }));
    }, [dispatch]);

    return {
        isOpened,
        handleSave,
        handleClose,
    };
};
