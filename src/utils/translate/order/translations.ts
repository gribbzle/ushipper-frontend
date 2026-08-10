import { toKebabCase } from 'js-convert-case';

import { translateByNamespace } from '@/utils/i18n';
import { OrderStatisticsGroup } from '@/enums/order/order-statistics-group';
import { OrderStatisticsStatus } from '@/enums/order/order-statistics-status';

const t = translateByNamespace('common:orders');

export const translateOrderStatisticsGroup = (status: OrderStatisticsGroup): string => t(`order-statistics-group:${toKebabCase(status)}`);

export const translateOrderStatisticsGroupTooltip = (status: OrderStatisticsGroup): string => t(`order-statistics-group:${toKebabCase(status)}-tooltip`);

export const translateOrderStatisticsStatus = (status: OrderStatisticsStatus): string => t(`order-statistics-statuses:${toKebabCase(status)}`);
