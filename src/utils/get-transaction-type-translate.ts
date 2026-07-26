import { toKebabCase } from 'js-convert-case';

import { TransactionTypesEnum } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';
import { LimitedBalanceTypesEnum } from '@components';

const transactionTypeTranslate = translateByNamespace('common:transaction-types');

export const getTransactionTypeTranslate = (type: TransactionTypesEnum, context?: LimitedBalanceTypesEnum): string => {
    const key = context ? `context-${toKebabCase(type)}` : toKebabCase(type);

    return context ? transactionTypeTranslate(key, { context: transactionTypeTranslate(toKebabCase(context)) }) : transactionTypeTranslate(key);
};
