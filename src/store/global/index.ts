import { HYDRATE } from 'next-redux-wrapper';
import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AccountToken } from '@store/client';
import { AccountData, AccountUser } from '@store/client/accounts';
import { composeBuilder } from '@utils';

import { revokeTokenAction } from './actions';
import { GlobalSliceState } from './types';

const initialState: GlobalSliceState = {
    user: null,
    account: null,
    accountUser: null,
    fetchUserStatus: null,
    token: null,
    tokens: null,
    permissions: null,
    fetchPermissionsStatus: null,
    driverPaymentRequestsCounter: null,
    driverPaymentRequestsCounterStatus: null,
    issuesCounter: null,
    issuesCounterStatus: null,
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        setAccount: (state, action: PayloadAction<AccountData>) => {
            state.account = action.payload;
        },
        setAccountTokens: (state, action: PayloadAction<AccountToken[]>) => {
            state.tokens = action.payload;
        },
        setAccountUser: (state, action: PayloadAction<AccountUser>) => {
            state.accountUser = Object.assign({}, action.payload);
        },
        setCountOfNewRequests: (state, action) => {
            if (state.user) {
                state.user.countOfNewRequests = action.payload;
            } else {
                return state;
            }
        },
        setCountOfNewOffers: (state, action) => {
            if (state.user) {
                state.user.countOfNewOffers = action.payload;
            } else {
                return state;
            }
        },
        setCountOfNewOrders: (state, action) => {
            if (state.user) {
                state.user.countOfNewOrders = action.payload;
            } else {
                return state;
            }
        },
        setFetchUserStatus: (state, action) => {
            state.fetchUserStatus = action.payload;
        },
        setPermissions: (state, action) => {
            state.permissions = action.payload;
        },
        setFetchPermissionsStatus: (state, action) => {
            state.fetchPermissionsStatus = action.payload;
        },
        setUserUnreadChatMessagesCount: (state, action) => {
            if (!state.user) {
                return state;
            }
            state.user.unreadChatMessagesCount = action.payload;
        },
        setUserUnreadNoficationsCount: (state, action) => {
            if (!state.user) {
                return state;
            }
            state.user.countOfUnreadNotifications = action.payload;
        },
        setDriverPaymentRequestsCounter: (state, action) => {
            if (!state.user) {
                return state;
            }
            state.driverPaymentRequestsCounter = action.payload;
        },
        setDriverPaymentRequestsCounterStatus: (state, action) => {
            state.driverPaymentRequestsCounterStatus = action.payload;
        },
        setIssuesCounter: (state, action) => {
            if (!state.user) {
                return state;
            }
            state.issuesCounter = action.payload;
        },
        setIssuesCounterStatus: (state, action) => {
            state.issuesCounterStatus = action.payload;
        },
    },
    extraReducers: builder => composeBuilder(builder, [revokeTokenAction]).addCase(HYDRATE, (_state, action: AnyAction) => action.payload.global),
});

export const globalActions = globalSlice.actions;

export * from './selectors';
export * from './actions';
