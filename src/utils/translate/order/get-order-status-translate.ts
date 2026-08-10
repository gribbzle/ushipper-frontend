import { toKebabCase } from 'js-convert-case';

import { OrderStatus } from '@/enums/order-status';
import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('common:order-status');

export const translateOrderStatus = (status: OrderStatus): string => t(toKebabCase(status));
export const translateShipperCancelledOrderStatus = (): string => t('shipper-order-cancelled');
export const translateCarrierPostedOrderStatus = (): string => t('carrier-posted');
export const translateDeletedOrderStatus = (): string => t('order-deleted');
