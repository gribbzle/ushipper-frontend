import { AxiosResponse } from 'axios';
import randomColor from 'randomcolor';

import { UserStatusEnum } from '@enums';
import { UserTracking } from '@store/client/tracking/types';
import { Avatar } from '@store/common/staff/avatar-types';
import { StaffFilters, User, UserFormState } from '@store/common/staff/types';
import { AuthorizedUserInfo } from '@store/global/shared-types';
import { CursorPagination, PaginatedData, PaginatedResponse } from '@utils/redux';

import { apiSlice } from './api-slice';

export type Driver = {
    publicId: string;
    avatar: Avatar | null;
    name: string;
    nickname?: string;
    phone: string;
    rating: number | null;
    status: UserStatusEnum;
    trailerCapacity: number;
};

export type Dispatcher = Omit<Driver, 'trailerCapacity'>;

export type GetDriversParams = {
    name?: string;
    publicIds?: string[];
    status?: UserStatusEnum;
    ownerAccountId?: string;
    cursor?: string;
    perPage?: number;
};

export type GetDispatchersParams = GetDriversParams;

export type UsersOrdersTrackingRequest = Partial<{
    query: string;
    hasOrders: number;
    accountId: string;
    locationRectangle: [number, number, number, number];
    page: number;
    perPage: number;
}>;

export type GetStatisticParams = { publicIds: string[]; type: 'gross' | 'miles' | 'avg-mile-cost'; statistics_period: string };

export type StatisticInformation = Array<{
    date: string;
    value: string | null;
}>;

export type UsersWithCursorPaginationResponse = {
    data: User[];
    nextCursor?: string | null;
};

export const usersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query<PaginatedData<User[]>, Partial<StaffFilters>>({
            query: params => {
                return {
                    url: 'users',
                    method: 'GET',
                    params,
                };
            },
            transformResponse: (response: { data: PaginatedData<User[]> }) => response.data,
            providesTags: (_response, _error) => [{ type: 'Users', id: 'LIST' }],
        }),
        getUsersWithCursorPagination: builder.query<UsersWithCursorPaginationResponse, Partial<StaffFilters>>({
            query: params => ({
                url: 'users',
                method: 'GET',
                params,
            }),
            transformResponse: (response: { data: UsersWithCursorPaginationResponse }) => response.data,
            serializeQueryArgs: ({ endpointName, queryArgs }) => {
                let key = `${endpointName}-cursor`;

                Object.entries(queryArgs)
                    .filter(([paramName, paramValue]) => paramName !== 'cursor' && paramValue !== undefined && paramValue !== null)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .forEach(([paramName, paramValue]) => {
                        key += `-${paramName}:${paramValue}`;
                    });

                return key;
            },
            merge: (currentCache, newItems) => {
                newItems.data.forEach(newItem => {
                    const index = currentCache.data.findIndex(cacheItem => cacheItem.publicId === newItem.publicId);

                    if (index === -1) {
                        currentCache.data.push(newItem);
                    } else {
                        currentCache.data[index] = newItem;
                    }
                });

                currentCache.nextCursor = newItems.nextCursor;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
            providesTags: (_response, _error) => [{ type: 'Users', id: 'LIST' }],
        }),
        getUser: builder.query<AuthorizedUserInfo, { id: string | undefined | number }>({
            query: ({ id }) => ({
                url: `users/${id}`,
                method: 'GET',
            }),
            transformResponse: (response: { data: AuthorizedUserInfo }) => response.data,
            providesTags: (_response, _error, { id }) => [{ type: 'Users', id }],
        }),
        getDrivers: builder.query<CursorPagination<Driver[]>, GetDriversParams>({
            query: params => {
                return {
                    url: 'drivers',
                    method: 'GET',
                    params,
                };
            },
            transformResponse: (response: { data: CursorPagination<Driver[]> }) => response.data,
            serializeQueryArgs: ({ queryArgs, endpointName }) => {
                const { cursor: _cursor, ...rest } = queryArgs;

                return Object.keys(rest).length ? `${endpointName}(${JSON.stringify(rest)})` : `${endpointName}({})`;
            },
            merge: (currentCache, newItems) => {
                const existingIds = new Set(currentCache.data.map(item => item.publicId));

                newItems.data.forEach(item => {
                    if (!existingIds.has(item.publicId)) {
                        currentCache.data.push(item);
                    }
                });
                currentCache.meta = newItems.meta;
                currentCache.links = newItems.links;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.cursor !== previousArg?.cursor;
            },
        }),
        getDispatchers: builder.query<CursorPagination<Dispatcher[]>, GetDispatchersParams>({
            query: params => ({
                url: 'dispatchers',
                method: 'GET',
                params,
            }),
            transformResponse: (response: { data: CursorPagination<Dispatcher[]> }) => response.data,
            serializeQueryArgs: ({ queryArgs, endpointName }) => {
                const { cursor: _cursor, ...rest } = queryArgs;

                return Object.keys(rest).length ? `${endpointName}(${JSON.stringify(rest)})` : `${endpointName}({})`;
            },
            merge: (currentCache, newItems) => {
                const existingIds = new Set(currentCache.data.map(item => item.publicId));

                newItems.data.forEach(item => {
                    if (!existingIds.has(item.publicId)) {
                        currentCache.data.push(item);
                    }
                });
                currentCache.meta = newItems.meta;
                currentCache.links = newItems.links;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.cursor !== previousArg?.cursor;
            },
        }),
        getTracking: builder.query<UserTracking[], UsersOrdersTrackingRequest>({
            query: params => ({
                url: 'users/tracking',
                method: 'GET',
                params: Object.fromEntries(Object.entries(params ?? {}).filter(([, value]) => value !== '' && value !== undefined && value !== null)),
            }),
            transformResponse: (response: AxiosResponse<PaginatedResponse<UserTracking[]>>): UserTracking[] => {
                const userTracking = response.data.data;

                userTracking.forEach(tracking => {
                    tracking.orders.forEach(order => {
                        order.color = randomColor({ luminosity: 'dark' });
                    });
                });

                return userTracking || [];
            },
        }),
        getStatistics: builder.query<StatisticInformation[], GetStatisticParams>({
            async queryFn({ publicIds, type, statistics_period }, _queryApi, _extraOptions, baseQuery) {
                const results = await Promise.all(
                    publicIds.map(
                        publicId =>
                            baseQuery({ method: 'GET', url: `users/${publicId}/statistics/${type}`, params: { statistics_period } }) as Promise<{
                                data: { data: { data: StatisticInformation } };
                            }>,
                    ),
                );

                return { data: results.map(result => result.data.data.data) };
            },
        }),
        updateUserFormData: builder.mutation<AuthorizedUserInfo, UserFormState>({
            query: ({ publicId, ...data }) => ({
                url: `users/${publicId}`,
                method: 'patch',
                data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            transformResponse: (response: { data: AuthorizedUserInfo }) => response.data,
        }),
        updateUserJSON: builder.mutation<AuthorizedUserInfo, UserFormState>({
            query: ({ publicId, ...data }) => ({
                url: `users/${publicId}`,
                method: 'patch',
                data,
            }),
            transformResponse: (response: { data: AuthorizedUserInfo }) => response.data,
        }),
        createUserFlag: builder.mutation<void, { publicId: string }>({
            query: ({ publicId }) => ({
                url: `users/${publicId}/flag`,
                method: 'post',
            }),
        }),
        deleteUserFlag: builder.mutation<void, { publicId: string }>({
            query: ({ publicId }) => ({
                url: `users/${publicId}/flag`,
                method: 'delete',
            }),
        }),
    }),
});

export const {
    useGetUserQuery,
    useLazyGetUserQuery,
    useGetUsersQuery,
    useLazyGetUsersQuery,
    useGetUsersWithCursorPaginationQuery,
    useGetTrackingQuery,
    useGetDriversQuery,
    useLazyGetDriversQuery,
    useGetDispatchersQuery,
    useLazyGetDispatchersQuery,
    useGetStatisticsQuery,
    useLazyGetStatisticsQuery,

    useUpdateUserFormDataMutation,
    useUpdateUserJSONMutation,
    useCreateUserFlagMutation,
    useDeleteUserFlagMutation,
} = usersApi;
