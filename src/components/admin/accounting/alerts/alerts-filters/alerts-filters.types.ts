import { IssueStatus } from '@/enums/issues/issue-status';
import { IssueType } from '@/enums/issues/issue-type';

export type AlertsFiltersFormState = {
    orderId: string;
    statuses: IssueStatus[];
    types: IssueType[];
};
