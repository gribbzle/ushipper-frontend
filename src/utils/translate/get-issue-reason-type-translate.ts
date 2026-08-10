import { toKebabCase } from 'js-convert-case';

import { IssueReasonTypesEnum } from '@/enums/issues/issue-reason-types-enum';
import { translateByNamespace } from '@/utils/i18n';

const issueReasonTypeTranslate = translateByNamespace('common:issue-reason-type');

export const getIssueReasonTypeTranslate = (type: IssueReasonTypesEnum): string => issueReasonTypeTranslate(toKebabCase(type));
