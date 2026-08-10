import { toKebabCase } from 'js-convert-case';

import { FuelTransactionStatus } from '@/enums/fuel/fuel-transaction-status-enum';
import { translateByNamespace } from '@/utils/i18n';

const fuelTransactionStatusTranslate = translateByNamespace('admin:fuel:transactions-page:statuses');

export const getFuelTransactionStatusTranslate = (status: FuelTransactionStatus): string => fuelTransactionStatusTranslate(toKebabCase(status));
