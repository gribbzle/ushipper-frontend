import { toKebabCase } from 'js-convert-case';

import { TransactionStatusesEnum } from '@/enums/transactions/transaction-statuses-enum';
import { translateByNamespace } from '@/utils/i18n';

const transactionStatusTranslate = translateByNamespace('common:transaction-statuses');

export const getTransactionStatusTranslate = (status: TransactionStatusesEnum): string => transactionStatusTranslate(toKebabCase(status));

export const getTransactionStatusOptionTranslate = (status: TransactionStatusesEnum): string => transactionStatusTranslate(`${toKebabCase(status)}-option`);
