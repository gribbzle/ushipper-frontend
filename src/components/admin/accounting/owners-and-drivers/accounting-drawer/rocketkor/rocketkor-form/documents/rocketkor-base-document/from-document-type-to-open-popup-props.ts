import { RocketkorDocumentsPopupsState } from '@store/admin';
import { DocumentType } from '@store/api/accounts-api';

export const fromDocumentTypeToOpenPopupProps = new Map<DocumentType, Partial<RocketkorDocumentsPopupsState>>([
    ['tax_document', { isTaxDocumentPopupOpened: true }],
    ['ownership_document', { isOwnershipDocumentPopupOpened: true }],
    ['passport', { isPassportPopupOpened: true }],
]);
