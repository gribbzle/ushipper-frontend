import { toKebabCase } from 'js-convert-case';

import { FundsTransferStatus } from '@/enums/funds-transfer-status';
import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('admin:orders-page:funds-transfer-status-actions');

export const translateFundsTransferStatusAction = (status: FundsTransferStatus): string => t(toKebabCase(status));
