import { toKebabCase } from 'js-convert-case';

import { translateByNamespace } from '@/utils/i18n';
import { IssueType } from '@enums';

const t = translateByNamespace('common:issue-type');

export const translateIssueType = (type: IssueType): string => t(toKebabCase(type));
