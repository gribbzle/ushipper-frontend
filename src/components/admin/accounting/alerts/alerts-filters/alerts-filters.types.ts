import { IssueStatus, IssueType } from '@enums';

export type AlertsFiltersFormState = {
    orderId: string;
    statuses: IssueStatus[];
    types: IssueType[];
};
