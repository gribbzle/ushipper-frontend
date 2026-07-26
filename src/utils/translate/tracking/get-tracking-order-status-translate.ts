import { toKebabCase } from 'js-convert-case';

import { TrackingOrderStatus } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const trackingOrderStatusTranslate = translateByNamespace('client:tracking-page:shipper-orders-statuses');

export const getTrackingOrderStatusTranslate = (status: TrackingOrderStatus): string => trackingOrderStatusTranslate(toKebabCase(status));
