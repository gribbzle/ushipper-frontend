import { toKebabCase } from 'js-convert-case';

import { PaymentMethod } from '@/enums/payment-method';
import { translateByNamespace } from '@/utils/i18n';

const paymentMethodTranslate = translateByNamespace('common:payment-methods');

export const getPaymentMethodTranslate = (method: PaymentMethod | 'ach' | 'uship'): string => paymentMethodTranslate(toKebabCase(method));
