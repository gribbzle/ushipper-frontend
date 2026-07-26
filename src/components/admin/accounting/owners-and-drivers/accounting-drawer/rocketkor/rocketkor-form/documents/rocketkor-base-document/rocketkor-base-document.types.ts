import { ReactNode } from 'react';

import { AccountingProfileDocument, DocumentType } from '@store/api/accounts-api';

export type RocketkorBaseDocumentProps = {
    type: DocumentType;
    handleAdd: () => void;
    renderDocumentBody: (document: AccountingProfileDocument) => ReactNode;
};
