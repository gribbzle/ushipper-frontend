import JsCookie from 'js-cookie';
import Router from 'next/router';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { UserRoleGroup } from '@/enums/user-role-group';
import { revokeToken } from '@api/auth';

import { authorizedUserSelector } from './selectors';

export const revokeTokenAction = createAsyncThunk<void, void>('global/revokeTokenRequest', async (_data, { rejectWithValue, getState }) => {
    try {
        const result = await revokeToken();

        JsCookie.remove('PrevTokenId');
        JsCookie.remove('PrevAuthorization');
        JsCookie.remove('PrevPublicUserId');
        JsCookie.remove('PrevPublicAccountId');

        const state = getState() as any;
        const authorizedUser = authorizedUserSelector(state);

        if (authorizedUser?.roleGroup === UserRoleGroup.ADMINISTRATORS) {
            Router.push('/admin/sign-in');
        } else {
            Router.push('/sign-in');
        }

        return result;
    } catch (error) {
        return rejectWithValue(error);
    }
});
