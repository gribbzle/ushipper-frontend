import { toKebabCase } from 'js-convert-case';

import { DriverLoadboardPaymentTermEnum } from '@/enums/driver-loadboard-payment-terms-enum';
import { translateByNamespace } from '@/utils/i18n';

const driverLoadboardPaymentTermsTranslate = translateByNamespace('common:driver-loadboard-payment-terms');

export const getDriverLoadboardPaymentTermTranslate = (term: DriverLoadboardPaymentTermEnum): string => driverLoadboardPaymentTermsTranslate(toKebabCase(term));
