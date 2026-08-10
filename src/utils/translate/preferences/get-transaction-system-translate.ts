import { toKebabCase } from 'js-convert-case';

import { TransactionSystemEnum } from '@/enums/preferences/transaction-system-enum';
import { translateByNamespace } from '@/utils/i18n';

const transactionSystemTranslate = translateByNamespace('common:transaction-systems');

export const getTransactionSystemTranslate = (system: TransactionSystemEnum): string => transactionSystemTranslate(toKebabCase(system));
