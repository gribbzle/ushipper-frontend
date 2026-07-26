import { toKebabCase } from 'js-convert-case';

import { TransactionTypeGroup } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const transactionTypeGroupTranslate = translateByNamespace('common:transaction-type-group');

export const getTransactionTypeGroupTranslate = (type: TransactionTypeGroup): string => transactionTypeGroupTranslate(toKebabCase(type));
