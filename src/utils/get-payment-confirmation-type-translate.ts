import { toKebabCase } from 'js-convert-case';

import { PaymentConfirmationType } from '@/enums/transactions/payment-confirmation-type';
import { translateByNamespace } from '@/utils/i18n';

const paymentConfirmationTypeTranslate = translateByNamespace('common:payment-confirmation-types');

export const getPaymentConfirmationTypeTranslate = (type: PaymentConfirmationType): string => paymentConfirmationTypeTranslate(toKebabCase(type));
