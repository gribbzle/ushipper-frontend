import React from 'react';

import { DocumentFormValue } from '../../document-form';

export type RocketkorDocumentPopupProps = {
    title: string;
    formBody: React.ReactElement;
    isOpened: boolean;
    handleSave: (values: DocumentFormValue) => void;
    handleClose: () => void;
};
