import { IssueStatus } from '@/enums/issues/issue-status';

export const isIssueResolved = (status: IssueStatus): boolean => status === IssueStatus.RESOLVED;
export const isIssueDeclined = (status: IssueStatus): boolean => status === IssueStatus.DECLINED;
