import { toKebabCase } from 'js-convert-case';

import { OrderSourcesEnum } from '@/enums/order-sources-enum';
import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('common:orders:order-source');

export const translateOrderSource = (status: OrderSourcesEnum): string => t(toKebabCase(status));
