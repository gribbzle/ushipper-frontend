import JsCookie from 'js-cookie';
import Router from 'next/router';
import { createAsyncThunk, Dispatch } from '@reduxjs/toolkit';

import { GrantTypeEnum } from '@/enums';
import {
    acceptInvitation,
    changeAccount,
    fetchedAccountUserToken,
    fetchedAuthorizedAccount,
    fetchedAuthorizedUser,
    fetchedUserPermissions,
    revokeToken,
    signIn,
} from '@api';
import { globalActions } from '@store/global';

import { SignInFormData, Token } from './types';

const setCookie = (name: string, value: string) => {
    JsCookie.set(name, value);
};

const getCookie = (name: string): string | undefined => {
    return JsCookie.get(name);
};

const setCurrentCookies = (tokenData: Token) => {
    setCookie('TokenId', tokenData.id);
    setCookie('Authorization', `Bearer ${tokenData.token}`);
    setCookie('PublicUserId', tokenData.userId);
    setCookie('PublicAccountId', tokenData.accountId);
};

const getCurrentCookies = () => {
    const TokenId = getCookie('TokenId');
    const Authorization = getCookie('Authorization');
    const PublicUserId = getCookie('PublicUserId');
    const PublicAccountId = getCookie('PublicAccountId');

    return { TokenId, Authorization, PublicUserId, PublicAccountId };
};

const setPrevCookies = () => {
    const { TokenId, Authorization, PublicUserId, PublicAccountId } = getCurrentCookies();

    if (TokenId && Authorization && PublicUserId && PublicAccountId) {
        setCookie('PrevTokenId', TokenId);
        setCookie('PrevAuthorization', Authorization);
        setCookie('PrevPublicUserId', PublicUserId);
        setCookie('PrevPublicAccountId', PublicAccountId);
    }
};

const restorePreviousCookies = () => {
    const prevTokenId = getCookie('PrevTokenId');
    const prevAuthorization = getCookie('PrevAuthorization');
    const prevPublicUserId = getCookie('PrevPublicUserId');
    const prevPublicAccountId = getCookie('PrevPublicAccountId');

    if (prevTokenId && prevAuthorization && prevPublicUserId && prevPublicAccountId) {
        setCookie('TokenId', prevTokenId);
        setCookie('Authorization', prevAuthorization);
        setCookie('PublicUserId', prevPublicUserId);
        setCookie('PublicAccountId', prevPublicAccountId);

        JsCookie.remove('PrevTokenId');
        JsCookie.remove('PrevAuthorization');
        JsCookie.remove('PrevPublicUserId');
        JsCookie.remove('PrevPublicAccountId');
    }

    return { prevAuthorization, prevPublicUserId, prevPublicAccountId };
};

export const signInFormSubmit = createAsyncThunk<void, SignInFormData>('signIn/signInFormSubmit', async (data, { rejectWithValue, dispatch }) => {
    try {
        const result = await signIn(data);
        const token = result.data;

        setCurrentCookies(token);

        const { user, error } = await fetchedAuthorizedUser(token.token, token.userId);

        if (!error) {
            dispatch(globalActions.setUser(user));
        }
    } catch (error) {
        return rejectWithValue(error);
    }
});

const processAccountData = async ({ token, userId, accountId, dispatch }: { token: string; userId: string; accountId: string; dispatch: Dispatch }) => {
    const { account, error: accountError } = await fetchedAuthorizedAccount(token, accountId);

    if (!accountError && account) {
        dispatch(globalActions.setAccount(account));

        const currentUser = account.users.find(accountUser => accountUser.publicId === userId);
        const tokens = [];

        if (currentUser) {
            tokens.push({
                token,
                userId: currentUser.publicId,
                companyId: currentUser.company?.publicId ?? '',
            });
            dispatch(globalActions.setAccountUser(currentUser));
        }

        const accountUsers = account.users.filter(accountUser => accountUser.publicId !== userId);

        for (const accountUser of accountUsers) {
            const { token: newToken, error } = await fetchedAccountUserToken(
                {
                    grantType: 'switch_user',
                    userPublicId: accountUser.publicId,
                },
                token,
            );

            if (newToken && !error) {
                tokens.push({
                    token: `Bearer ${newToken.token}`,
                    userId: accountUser.publicId,
                    companyId: accountUser.company?.publicId ?? '',
                });
            }
        }

        dispatch(globalActions.setAccountTokens(tokens));
    }
};

const processUserData = async ({ token, userId, dispatch }: { token: string; userId: string; dispatch: Dispatch }) => {
    const { user, status, error } = await fetchedAuthorizedUser(token, userId);

    if (error) {
        dispatch(globalActions.setFetchUserStatus(status));
    } else {
        dispatch(globalActions.setUser(user));
        dispatch(globalActions.setFetchUserStatus(status));

        if (user?.roleId) {
            const { permissions, status, error } = await fetchedUserPermissions(token, user.roleId);

            if (error) {
                dispatch(globalActions.setFetchPermissionsStatus(status));
            } else {
                dispatch(globalActions.setPermissions(permissions));
                dispatch(globalActions.setFetchPermissionsStatus(status));
            }
        }
    }
};

export const changeAccountSubmit = createAsyncThunk<void, { publicId: string; isAdmin?: boolean }>(
    'signIn/changeAccountSubmit',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            const result = await changeAccount({ grantType: GrantTypeEnum.SWITCH_USER, userPublicId: data.publicId });

            if (data.isAdmin) {
                setPrevCookies();
            }

            setCurrentCookies(result.data);

            await processAccountData({ token: result.data.token, accountId: result.data.accountId, userId: result.data.userId, dispatch });
            await processUserData({ token: result.data.token, userId: result.data.userId, dispatch });
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const backToAdminSubmit = createAsyncThunk<void, void>('signIn/backtoAdminSubmit', async (data, { rejectWithValue, dispatch }) => {
    try {
        await revokeToken();

        const { prevAuthorization, prevPublicUserId, prevPublicAccountId } = restorePreviousCookies();

        if (prevAuthorization && prevPublicUserId && prevPublicAccountId) {
            await processAccountData({ token: prevAuthorization, accountId: prevPublicAccountId, userId: prevPublicUserId, dispatch });
            await processUserData({ token: prevAuthorization, userId: prevPublicUserId, dispatch });

            await Router.push('/admin/users');
        }
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const acceptInvitationSubmit = createAsyncThunk<void, string>('signIn/acceptInvitationSubmit', async (code, { rejectWithValue, dispatch }) => {
    try {
        const result = await acceptInvitation({ grantType: GrantTypeEnum.INVITATION_CODE, code: code });

        setCurrentCookies(result.data);

        await processAccountData({ token: `Bearer ${result.data.token}`, accountId: result.data.accountId, userId: result.data.userId, dispatch });
        await processUserData({ token: `Bearer ${result.data.token}`, userId: result.data.userId, dispatch });
    } catch (error) {
        return rejectWithValue(error);
    }
});
