import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { accountingActions } from '@store/admin';

import { ExtendedDocumentBody } from '../extended-document-body';
import { RocketkorBaseDocument } from '../rocketkor-base-document';

export const OwnershipDocument = () => {
    const dispatch = useDispatch();

    const handleOpenTaxDocumentPopup = useCallback(() => {
        dispatch(accountingActions.setRocketkorDocumentPopupProps({ isOwnershipDocumentPopupOpened: true }));
    }, [dispatch]);

    return (
        <RocketkorBaseDocument
            renderDocumentBody={document => <ExtendedDocumentBody document={document} />}
            handleAdd={handleOpenTaxDocumentPopup}
            type='ownership_document'
        />
    );
};
