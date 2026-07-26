import { IssueStatus } from '@enums';

export const isIssueResolved = (status: IssueStatus): boolean => status === IssueStatus.RESOLVED;
export const isIssueDeclined = (status: IssueStatus): boolean => status === IssueStatus.DECLINED;
