import { toKebabCase } from 'js-convert-case';

import { CompanyStatusEnum } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const companyStatusTranslate = translateByNamespace('common:company-statuses');

export const getCompanyStatusTranslate = (status: CompanyStatusEnum): string => companyStatusTranslate(toKebabCase(status));
