import { IssueStatus } from '@enums';

export const ISSUE_STATUS_TAG_VIEW: Record<IssueStatus, string> = {
    [IssueStatus.PENDING]: 'picked-up',
    [IssueStatus.RESOLVED]: 'delivered',
    [IssueStatus.DECLINED]: 'source-declined',
};
