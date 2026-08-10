import { toKebabCase } from 'js-convert-case';

import { BusinessTypesEnum } from '@/enums/business-types-enum';
import { translateByNamespace } from '@/utils/i18n';

const businessTypeTranslate = translateByNamespace('common:business-types');

export const getBusinessTypeTranslate = (type: BusinessTypesEnum): string => businessTypeTranslate(toKebabCase(type).replace(/\//g, '-'));
