import { toKebabCase } from 'js-convert-case';

import { InstantTermPaymentType } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('common:orders:instant-term-payment-type');

export const translatePaymentForm = (type: InstantTermPaymentType): string => t(`${toKebabCase(type)}-form`);

export const translateActionRequired = (): string => t('action-required');

export const driverPaymentTagLabelTranslate = translateByNamespace('admin:orders-page:driver-payment-tag:labels');

export const translateDriverPaymentTagLabel = (type: InstantTermPaymentType): string => driverPaymentTagLabelTranslate(`${toKebabCase(type)}`);
