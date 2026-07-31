import { DocumentType } from '@store/api/accounts-api';
import { translateByNamespace } from '@utils/i18n';

const t = translateByNamespace('admin:accounting:owners-and-drivers:accounting-drawer:rocketkor');

export const fromDocumentTypeToTitle = new Map<DocumentType, string>([
    ['tax_document', t('tax')],
    ['ownership_document', t('document')],
    ['passport', t('passport')],
]);
