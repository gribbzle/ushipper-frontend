import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { accountingActions } from '@store/admin';
import { classname } from '@utils/classname';

import { RocketkorBaseDocument } from '../rocketkor-base-document';

const cn = classname('extended-document-body');

export const TaxDocument = () => {
    const dispatch = useDispatch();

    const handleOpenTaxDocumentPopup = useCallback(() => {
        dispatch(accountingActions.setRocketkorDocumentPopupProps({ isTaxDocumentPopupOpened: true }));
    }, [dispatch]);

    return (
        <RocketkorBaseDocument
            renderDocumentBody={document => (
                <>
                    <div className={cn('title')}>{document.name}</div>
                    <div className={cn('description')}>{document.description}</div>
                </>
            )}
            handleAdd={handleOpenTaxDocumentPopup}
            type='tax_document'
        />
    );
};
