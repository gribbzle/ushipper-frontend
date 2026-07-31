import { UserRoleType } from '@/enums';
import { UserRole } from '@/store/common/staff/types';

import { apiSlice } from './api-slice';

export type GetRolesQueryType = {
    companyId?: string | undefined;
    subordinationPossibleForRoleId?: string;
    type?: UserRoleType;
    superiorRoleId?: string;
};

const rolesApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRoles: builder.query<UserRole[], GetRolesQueryType>({
            query: params => ({
                url: 'roles',
                params,
            }),
            transformResponse: (response: { data: UserRole[] }) => response.data,
        }),
    }),
});

export const { useGetRolesQuery } = rolesApi;
