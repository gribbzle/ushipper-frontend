import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { accountingActions } from '@store/admin';

import { ExtendedDocumentBody } from '../extended-document-body';
import { RocketkorBaseDocument } from '../rocketkor-base-document';

export const PassportDocument = () => {
    const dispatch = useDispatch();

    const handleOpenTaxDocumentPopup = useCallback(() => {
        dispatch(accountingActions.setRocketkorDocumentPopupProps({ isPassportPopupOpened: true }));
    }, [dispatch]);

    return (
        <RocketkorBaseDocument
            renderDocumentBody={document => <ExtendedDocumentBody document={document} />}
            handleAdd={handleOpenTaxDocumentPopup}
            type='passport'
        />
    );
};
