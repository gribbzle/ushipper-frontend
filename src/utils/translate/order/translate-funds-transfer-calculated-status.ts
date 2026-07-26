import { toKebabCase } from 'js-convert-case';

import { FundsTransferCalculatedStatus } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('common:orders:funds-transfer-calculated-status');

export const translateFundsTransferCalculatedStatus = (status: FundsTransferCalculatedStatus): string => t(toKebabCase(status));
