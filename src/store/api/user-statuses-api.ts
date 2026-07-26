import { apiSlice } from './api-slice';

const userStatusesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUserStatuses: builder.query<string[], void>({
            query: () => ({
                url: 'user-statuses',
                method: 'get',
            }),
            transformResponse: (response: { data: string[] }) => response.data,
        }),
    }),
});

export const { useGetUserStatusesQuery } = userStatusesApi;
