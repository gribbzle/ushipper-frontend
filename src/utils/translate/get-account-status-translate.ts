import { toKebabCase } from 'js-convert-case';

import { AccountStatusesEnum } from '@/enums/account/account-statuses-enum';
import { translateByNamespace } from '@/utils/i18n';

const accountStatusTranslate = translateByNamespace('common:account-statuses');

export const getAccountStatusTranslate = (status: AccountStatusesEnum): string => accountStatusTranslate(toKebabCase(status));
