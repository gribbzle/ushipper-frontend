import { toKebabCase } from 'js-convert-case';

import { AccountStatusesEnum } from '@/enums';
import { translateByNamespace } from '@/utils/i18n';

const accountStatusTranslate = translateByNamespace('common:account-statuses');

export const getAccountStatusTranslate = (status: AccountStatusesEnum): string => accountStatusTranslate(toKebabCase(status));
