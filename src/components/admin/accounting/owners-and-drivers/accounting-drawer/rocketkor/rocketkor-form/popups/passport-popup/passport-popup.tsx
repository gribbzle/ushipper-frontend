import React from 'react';

import { translateByNamespace } from '@utils/i18n';

import { DocumentForm } from '../../document-form/document-form';
import { RocketkorDocumentPopup } from '../rocketkor-document-popup';

import { usePassportPopup } from './use-passport-popup';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const PassportPopup = () => {
    const { isOpened, handleSave, handleClose } = usePassportPopup();

    return (
        <RocketkorDocumentPopup title={t('add-passport')} isOpened={isOpened} handleClose={handleClose} handleSave={handleSave} formBody={<DocumentForm />} />
    );
};
