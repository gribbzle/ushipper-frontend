import { toKebabCase } from 'js-convert-case';

import { FactoringProvider } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const t = translateByNamespace('common:accounting:factoring-providers');

export const getFactoringProviderTranslation = (provider: FactoringProvider): string => t(toKebabCase(provider));
