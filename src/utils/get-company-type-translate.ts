import { toKebabCase } from 'js-convert-case';

import { translateByNamespace } from '@/utils/i18n';

const companyTypeTranslate = translateByNamespace('common:company-types');

export const getCompanyTypeTranslate = (type: string): string => companyTypeTranslate(toKebabCase(type));
