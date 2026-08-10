import { toKebabCase } from 'js-convert-case';

import { TransactionTypeGroup } from '@/enums/transactions/transaction-type-group';
import { translateByNamespace } from '@/utils/i18n';

const transactionTypeGroupTranslate = translateByNamespace('common:transaction-type-group');

export const getTransactionTypeGroupTranslate = (type: TransactionTypeGroup): string => transactionTypeGroupTranslate(toKebabCase(type));
