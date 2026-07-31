import React from 'react';

import { translateByNamespace } from '@utils/i18n';

import { DocumentForm } from '../../document-form/document-form';
import { RocketkorDocumentPopup } from '../rocketkor-document-popup';

import { useOwnershipDocumentPopup } from './use-ownership-document-popup';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const OwnershipDocumentPopup = () => {
    const { isOpened, handleSave, handleClose } = useOwnershipDocumentPopup();

    return (
        <RocketkorDocumentPopup title={t('add-document')} isOpened={isOpened} handleClose={handleClose} handleSave={handleSave} formBody={<DocumentForm />} />
    );
};
