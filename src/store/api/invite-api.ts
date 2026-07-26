import { InviteUserFormData } from '@/components/client/staff/invite-user-drawer/invite-user-drawer.types';
import { InvitationAction } from '@store/client';

import { apiSlice } from './api-slice';

export const inviteApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        inviteUser: builder.mutation<void, InviteUserFormData>({
            query: data => ({
                url: 'invitations',
                data,
                method: 'post',
            }),
        }),
        getInvitationAction: builder.query<InvitationAction, string>({
            query: code => ({
                url: `invitations/${code}/action`,
                method: 'get',
            }),
            transformResponse: (response: { data: InvitationAction }) => response.data,
        }),
    }),
});

export const { useInviteUserMutation, useGetInvitationActionQuery } = inviteApi;
