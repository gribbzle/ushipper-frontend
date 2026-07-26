import { toKebabCase } from 'js-convert-case';

import { FundsTransferStatus } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('common:funds-transfer-status');

export const translateFundsTransferStatus = (status: FundsTransferStatus): string => t(toKebabCase(status));

export const translateShortFundsTransferStatus = (status: FundsTransferStatus): string => t(`short-${toKebabCase(status)}`);

export const translateActivityFundsTransferStatus = (status: FundsTransferStatus): string => t(`activity-${toKebabCase(status)}`);

export const getAwaitingDeliveryLabel = (): string => t('awaiting-delivery');
