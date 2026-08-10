import { toKebabCase } from 'js-convert-case';

import { InstantTermPaymentType } from '@/enums/instant-term-payment-type';
import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('common:payment-recipient-types');

export const getPaymentRecipientTranslate = (type: InstantTermPaymentType): string => t(toKebabCase(type));

export const getDriverPaymentRecipientTranslate = (type: InstantTermPaymentType): string => t(`driver-view-${toKebabCase(type)}`);
