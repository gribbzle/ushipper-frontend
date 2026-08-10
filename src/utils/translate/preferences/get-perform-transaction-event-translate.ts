import { toKebabCase } from 'js-convert-case';

import { PerformTransactionEventEnum } from '@/enums/preferences/perform-transaction-event-enum';
import { translateByNamespace } from '@/utils/i18n';

const performTransactionEventTranslate = translateByNamespace('common:perform-transaction-events');

export const getPerformTransactionEventTranslate = (event: PerformTransactionEventEnum): string => performTransactionEventTranslate(toKebabCase(event));
