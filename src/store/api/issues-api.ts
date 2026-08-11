import { ChangeDetails } from '@/shared/types';
import { IssueReasonTypesEnum } from '@/enums/issues/issue-reason-types-enum';
import { IssueStatus } from '@/enums/issues/issue-status';
import { IssueType } from '@/enums/issues/issue-type';

import { PaginatedResponse } from '../../utils/redux';

import { apiSlice } from './api-slice';

export type GetIssuesParams = Partial<{
    orderId: string;
    statuses: IssueStatus[];
    types: IssueType[];
    orderName: string;
    orderDirection: string;
    page: number;
    perPage: number;
    lastPage: number;
    cursor: string | null;
}>;

export type IssueProcessedByData = {
    id: string;
    name: string;
};

export type IssueReasonEntityData = {
    id: string;
    type: IssueReasonTypesEnum;
};

export type IssueChangedByData = {
    id: string;
    name: string;
};

export type ChangesInfoDetails = ChangeDetails & { changedBy?: IssueChangedByData; changedDriverId?: string | null };

export type IssueData = {
    id: number;
    status: IssueStatus;
    type: IssueType;
    createdAt: string;
    processedAt: string | null;
    processedBy: IssueProcessedByData | null;
    reasonEntity: IssueReasonEntityData | null;
    payload: ChangesInfoDetails | object;
};

export type IssuesCountersData = {
    pending: number;
};

export type UpdateIssueValues = {
    status: Omit<IssueStatus, 'pending'>;
};

export const issuesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getIssues: builder.query<PaginatedResponse<IssueData[]>, GetIssuesParams>({
            query: params => ({
                url: 'issues',
                method: 'get',
                params,
            }),
            transformResponse: (response: { data: PaginatedResponse<IssueData[]> }) => response.data,
            providesTags: [{ type: 'Issues', id: 'LIST' }],
        }),
        partiallyUpdateIssue: builder.mutation<IssueData, { issueId: number; data: UpdateIssueValues }>({
            query: ({ issueId, data }) => ({
                url: `issues/${issueId}`,
                method: 'patch',
                data,
            }),
            invalidatesTags: result => [
                { type: 'Issues', id: 'LIST' },
                { type: 'Issues', id: result?.id },
            ],
        }),
        getIssuesStatistic: builder.query<IssuesCountersData, void>({
            query: () => ({
                url: 'issues/counters',
                method: 'get',
            }),
            transformResponse: (response: { data: IssuesCountersData }) => response.data,
            providesTags: [{ type: 'IssuesStats' }],
        }),
    }),
});

export const { useGetIssuesQuery, usePartiallyUpdateIssueMutation } = issuesApi;
